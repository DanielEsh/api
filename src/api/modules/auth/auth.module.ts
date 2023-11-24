import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './helpers/auth.helpers';
import {
  AccessJwtStrategy,
  RefreshJwtStrategy,
  LocalStrategy,
} from './strategy';
import { StaffModule } from '../staff/staff.module';
import { Staff } from '../staff/entity/staff.entity';

@Module({
  imports: [
    StaffModule,
    PassportModule,
    TypeOrmModule.forFeature([Staff]),
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    AuthHelper,
    LocalStrategy,
    AccessJwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
