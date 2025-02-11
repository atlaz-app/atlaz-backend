import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordGuard } from './guards/password.guard';
import { Public } from './decorators/public.decorator';
import { RefreshDto, RegisterDto, VerifyEmailDto } from './auth.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Public()
  @UseGuards(PasswordGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(
      req.user as {
        id: number;
        email: string;
      },
    );
  }

  @Post('test')
  getProfile(@Req() req: Request) {
    return {
      message: 'You are authenticated!',
      user: req.user,
    };
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshTokens(refreshDto);
  }
}
