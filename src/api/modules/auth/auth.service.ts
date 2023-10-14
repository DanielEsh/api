import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthHelper } from './helpers/auth.helpers';
import { User } from '../user/entity/user.entity';
import { Response } from 'express';
import { cookieOptions } from '../../../utils/cookie';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  @Inject(AuthHelper)
  private readonly authHelper: AuthHelper;

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmailOrName(username);

    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = this.authHelper.isPasswordValid(
      pass,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('password is not valid', HttpStatus.NOT_FOUND);
    }

    const { password, lastLoginAt, ...result } = user;

    return result;
  }

  async signIn(user: User, res: Response) {
    const accessToken = await this.authHelper.generateAccessToken(user);
    const refreshToken = await this.authHelper.generateRefreshToken(user);
    await this.usersService.updateRefreshTokenHash(user.id, refreshToken);
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refresh(userId: number, refreshToken: string, res: Response) {
    const user = await this.usersService.findById(userId);

    if (!user) throw new ForbiddenException('Access denied');

    const matchTokens = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!matchTokens) throw new ForbiddenException('Access denied');

    const accessToken = await this.authHelper.generateAccessToken(user);
    res.cookie('accessToken', accessToken, cookieOptions);

    return {
      accessToken,
    };
  }

  public async logout(userId: number, response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    await this.usersService.updateUserById(userId, {
      hashedRefreshToken: null,
    });
  }
}
