import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { AuthHelper } from './helpers/auth.helpers';
import { Response } from 'express';
import { cookieOptions } from '../../../utils/cookie';
import * as bcrypt from 'bcryptjs';
import { StaffService } from '../staff/staff.service';
import { Staff } from '../staff/entity/staff.entity';

@Injectable()
export class AuthService {
  constructor(private staffService: StaffService) {}

  @Inject(AuthHelper)
  private readonly authHelper: AuthHelper;

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.staffService.findStaffByEmailOrNickName(username);

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

    // TODO: используется что бы удалять поля из выдачи
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, lastLoginAt, ...result } = user;

    return result;
  }

  async signIn(user: Staff, res: Response) {
    const accessToken = this.authHelper.generateAccessToken(user);
    const refreshToken = this.authHelper.generateRefreshToken(user);
    await this.staffService.updateRefreshTokenHash(user.id, refreshToken);
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async refresh(userId: number, refreshToken: string, res: Response) {
    const user = await this.staffService.findOneById(userId);
    if (!user) throw new ForbiddenException('Access denied');

    const matchTokens = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!matchTokens) throw new ForbiddenException('Access denied');

    const accessToken = this.authHelper.generateAccessToken(user);
    res.cookie('accessToken', accessToken, cookieOptions);

    return {
      accessToken,
    };
  }

  public async logout(userId: number, response: Response) {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    await this.staffService.update(userId, {
      hashedRefreshToken: null,
    });
  }
}
