import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

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

    // Устанавливаем refresh_token в HttpOnly куки для безопасности
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true, // Используйте только при HTTPS
      sameSite: 'strict',
    });

    // Возвращаем access_token для клиентской стороны
    return res.json({ access_token });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const { access_token, refresh_token: new_refresh_token } =
      await this.authService.refreshToken(refreshToken);

    // Обновляем refresh_token в куки
    res.cookie('refresh_token', new_refresh_token, {
      httpOnly: true,
      secure: true, // Используйте только при HTTPS
      sameSite: 'strict',
    });

    // Возвращаем новый access_token клиенту
    return res.json({ access_token });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    await this.authService.logout(refreshToken);
    // Очищаем refresh_token из куки
    res.clearCookie('refresh_token');
    return res.send();
  }
}
