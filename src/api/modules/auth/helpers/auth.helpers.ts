import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { Staff } from '../../staff/entity/staff.entity';

@Injectable()
export class AuthHelper {
  @InjectRepository(Staff)
  private readonly staffRepository: Repository<Staff>;
  private readonly jwt: JwtService;
  private readonly config: ConfigService;

  constructor(jwt: JwtService, config: ConfigService) {
    this.jwt = jwt;
    this.config = config;
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<Staff> {
    return this.staffRepository.findOne(decoded.id);
  }

  // Generate Access JWT Token
  public generateAccessToken(user: Staff): string {
    return this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      {
        secret: this.config.get('JWT_ACCESS_KEY'),
        expiresIn: 60 * 5, // 5min
      },
    );
  }

  public generateRefreshToken(user: Staff): string {
    return this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      {
        secret: this.config.get('JWT_REFRESH_KEY'),
        expiresIn: 60 * 60 * 24 * 7, // 7d
      },
    );
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  private async validate(token: string): Promise<Staff | never> {
    const decoded: unknown = this.jwt.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: Staff = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
