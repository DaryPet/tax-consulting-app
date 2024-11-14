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
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Request, Response } from 'express';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('Запрос на регистрацию получен с данными:', createUserDto);
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
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    // Возвращаем access_token для клиентской стороны
    return res.json({ access_token });
  }
  // @Post('login')
  // async login(@Body() loginDto: any, @Res() res: Response) {
  //   try {
  //     const { access_token, refresh_token } =
  //       await this.authService.login(loginDto);

  //     // ИЗМЕНИЛ ЗДЕСЬ: Устанавливаем refresh_token в куку с нужными параметрами
  //     res.cookie('refresh_token', refresh_token, {
  //       httpOnly: true, // Защита куки от JavaScript
  //       secure: false, // ИЗМЕНИЛ ЗДЕСЬ: Используйте false для локальной разработки, true для продакшн
  //       sameSite: 'lax', // ИЗМЕНИЛ ЗДЕСЬ: Использовать 'Lax' для кросс-доменных запросов
  //       maxAge: 24 * 60 * 60 * 1000, // 1 день
  //     });

  //     return res.status(HttpStatus.OK).json({
  //       access_token,
  //       user: { username: loginDto.username },
  //     });
  //   } catch (error) {
  //     return res.status(HttpStatus.UNAUTHORIZED).json({
  //       message: 'Invalid credentials',
  //     });
  //   }
  // }

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
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    // Возвращаем новый access_token клиенту
    return res.json({ access_token });
  }

  @Post('logout')
  // @UseGuards(JwtAuthGuard)
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('Запрос на логаут получен');
    console.log('Пользователь в req.user:', req.user);
    // Логи для дебага
    console.log('Cookies в запросе:', req.cookies);
    console.log('Заголовки в запросе:', req.headers);

    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    await this.authService.logout(refreshToken);
    // Очищаем куку с refresh_token, чтобы завершить сессию
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    // return res.send();
    return res.status(HttpStatus.NO_CONTENT).send();
  }
  // Новый метод для получения информации о текущем пользователе
  @UseGuards(JwtAuthGuard) // Используем guard для защиты этого маршрута
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const user = req.user; // req.user будет содержать информацию о пользователе, если JwtAuthGuard успешно отработал
    console.log('Текущий пользователь вот (req.user):', req.user);
    return this.authService.getCurrentUser(user);
  }
}
