import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { Public, ResponseMessage } from '@/decorator/customize';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Public()
  @ResponseMessage('User login')
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: any,
    @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Get('refresh')
  @ResponseMessage('Get User by refresh token')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage('Get user information')
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @ResponseMessage('Logout User')
  @Post('logout')
  async handleLogout(
    @Req() req: any,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.logout(req.user, response);
  }

}
