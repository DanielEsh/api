import { Controller, Req, Res, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AccessJwtAuthGuard, RefreshJwtAuthGuard } from './guards';
import { getCurrentUser } from '../staff/decorator/get-current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('signIn')
  async signIn(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(req.user, res);
  }

  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  private refresh(
    @getCurrentUser() user,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(user.id, user.refreshToken, res);
  }

  @Post('logout')
  @UseGuards(AccessJwtAuthGuard)
  private async logOut(
    @getCurrentUser() user,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id, res);
    return {
      message: 'Success',
    };
  }
}
