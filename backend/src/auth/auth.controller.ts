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
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';

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
    const { access_token, refresh_token, session_id } =
      await this.authService.login(user);

    res.cookie('sessionId', session_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 день
      path: '/',
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 день
      path: '/',
    });

    return res.json({ access_token });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.cookies['sessionId'];
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken || !sessionId) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const updatedSession = await this.authService.refreshUserSession(
      sessionId,
      refreshToken,
    );

    res.cookie('sessionId', updatedSession.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 день
      path: '/',
    });

    res.cookie('refresh_token', updatedSession.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 день
      path: '/',
    });

    return res.json({ access_token: updatedSession.accessToken });
  }

  @Post('logout')
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('Запрос на логаут получен');

    const sessionId = req.cookies['sessionId'];
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken || !sessionId) {
      console.error('Не удалось найти refresh_token или sessionId в куках');
      throw new UnauthorizedException('Refresh token is required');
    }

    await this.authService.logout(sessionId, refreshToken);

    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    console.log('Сессия успешно завершена');
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Get('me')
  //   async getCurrentUser(@Req() req: Request) {
  //     console.log('Authorization Header:', req.headers.authorization); // Логируем заголовок
  //     console.log('Access Token from Cookies:', req.cookies['access_token']); // Логируем токен из куков

  //     const user = req.user;
  //     console.log('Текущий пользователь (req.user):', req.user);
  //     return this.authService.getCurrentUser(user);
  //   }
  // }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    console.log('Authorization Header:', req.headers.authorization);
    console.log('Access Token from Cookies:', req.cookies['access_token']);

    if (!req.headers.authorization) {
      console.error('Authorization header is missing');
    }

    if (!req.cookies['access_token']) {
      console.error('Access token is missing in cookies');
    }

    const user = req.user;
    if (!user) {
      console.error('Ошибка: req.user не определен');
      throw new UnauthorizedException('User not authenticated');
    }

    console.log('Текущий пользователь (req.user):', user);

    const currentUser = await this.authService.getCurrentUser(user);
    console.log('Возвращаемый пользователь:', currentUser);

    return currentUser;
  }
}
