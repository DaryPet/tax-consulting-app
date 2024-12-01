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

    console.log('Куки установлены: sessionId и refresh_token');
    return res.json({ access_token });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    console.log('при запросе на обновление токена:', req.cookies);
    // console.log(req.body); // если вам нужно тело запроса
    // console.log(req.headers); // если нужны заголовки
    // console.log(req.query); // если вам нужны параметры строки запроса

    const sessionId = req.cookies.sessionId;
    const refreshToken = req.cookies.refresh_token;
    console.log('perevirka', sessionId, refreshToken);

    // if (!refreshToken || !sessionId) {
    //   console.error(
    //     'Ошибка: Не удалось найти refresh_token или sessionId в куках',
    //   );
    //   throw new UnauthorizedException('Refresh token is required');
    // }

    const updatedSession = await this.authService.refreshUserSession(
      sessionId,
      refreshToken,
    );
    // \\\\\\\\\\\\\\
    console.log('je', updatedSession);
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
    if (!res.getHeader('Set-Cookie')) {
      console.error('Ошибка: Куки не обновлены после обновления');
    }
    console.log('Куки обновлены: sessionId и refresh_token');
    return res.json({ access_token: updatedSession.accessToken });
  }

  @Post('logout')
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('Запрос на логаут получен');

    const sessionId = req.cookies.sessionId;
    const refreshToken = req.cookies.refresh_token;

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

  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    console.log('hj');
    console.log('Authorization:', req.headers.authorization);
    // console.log('Access Token from Cookies:', req.cookies.access_token);
    console.log('Refresh Token from Cookies:', req.cookies.refresh_token);

    if (!req.headers.authorization) {
      console.error('Authorization header is missing');
    }

    if (!req.cookies.refresh_token) {
      console.error('Refresh token is missing in cookies');
    }
    const currentSession = await this.authService.getSessionById(
      req.cookies.sessionId,
    );
    console.log(currentSession.userId);
    if (!currentSession.userId) {
      console.error('Ошибка: req.user не определен');
      throw new UnauthorizedException('User not authenticated');
    }

    console.log('Текущий пользователь (req.user):', currentSession.userId);

    const currentUser = await this.authService.getCurrentUser(
      currentSession.userId,
    );
    console.log('Возвращаемый пользователь:', currentUser);

    return currentUser;
  }
}
