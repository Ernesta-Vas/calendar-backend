import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  testApp() {
    return 'App is started';
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const data = await this.authService.login(req.user);
    response.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: false,
    });
    return { access_token: data.access_token, username: data.username };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    console.log(req.user);
    return this.authService.getProfile(req.user.id);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  async refresh(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    console.log(req.cookies, 'req with cookies');
    console.log(refreshToken, 'refr');
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
    const data = await this.authService.refreshToken(refreshToken);
    console.log('data refresh', data);
    response.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: false,
    });
    return { access_token: data.access_token };
  }
}
