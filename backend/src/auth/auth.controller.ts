import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //   @Post('login')
  //   async login(@Body() loginDto: any) {
  //     const user = await this.authService.validateUser(
  //       loginDto.username,
  //       loginDto.password,
  //     );
  //     if (!user) {
  //       throw new UnauthorizedException('Invalid credentials');
  //     }
  //     return this.authService.login(user);
  //   }
  @Post('login')
  async login(@Body() loginDto: any, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { access_token, refresh_token } = await this.authService.login(user);

    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 час
      })
      .cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      })
      .send({ message: 'Login successful' });
  }
  //   @Post('refresh')
  //   async refresh(@Body() body: any) {
  //     const { refreshToken } = body;
  //     return this.authService.refreshToken(refreshToken);
  //   }
  @Post('refresh')
  async refresh(@Body() body: any, @Res() res: Response) {
    const { refreshToken } = body;
    const { access_token, refresh_token } =
      await this.authService.refreshToken(refreshToken);

    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 час
      })
      .cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      })
      .send({ message: 'Token refreshed successfully' });
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Post('logout')
  //   @HttpCode(HttpStatus.NO_CONTENT)
  //   async logout(@Body() body: any) {
  //     const { refreshToken } = body;
  //     if (!refreshToken) {
  //       throw new UnauthorizedException('Refresh token is required');
  //     }
  //     await this.authService.logout(refreshToken);
  //   }
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() body: any, @Res() res: Response) {
    const { refreshToken } = body;
    await this.authService.logout(refreshToken);

    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .send({ message: 'Logout successful' });
  }
}
