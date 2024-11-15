// import {
//   Controller,
//   Post,
//   Body,
//   HttpCode,
//   HttpStatus,
//   UseGuards,
//   UnauthorizedException,
//   Req,
//   Res,
//   Get,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { JwtAuthGuard } from './jwt-auth.guard';
// import { CreateUserDto } from '../user/dto/create-user.dto';
// import { Request, Response } from 'express';
// import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard.js';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('register')
//   async register(@Body() createUserDto: CreateUserDto) {
//     console.log('Запрос на регистрацию получен с данными:', createUserDto);
//     return this.authService.register(createUserDto);
//   }

//   // @Post('login')
//   // async login(@Body() loginDto: any, @Res() res: Response) {
//   //   const user = await this.authService.validateUser(
//   //     loginDto.username,
//   //     loginDto.password,
//   //   );
//   //   if (!user) {
//   //     throw new UnauthorizedException('Invalid credentials');
//   //   }
//   //   const { access_token, refresh_token } = await this.authService.login(user);

//   //   res.cookie('sessionId', user.id, {
//   //     httpOnly: true,
//   //     secure: process.env.NODE_ENV === 'production', // ИСПРАВИЛ ЗДЕСЬ: ОСТАВИЛ УСЛОВИЕ ДЛЯ ПРОДА И РАЗРАБОТКИ
//   //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Обеспечение работы куков как в проде, так и локально
//   //     maxAge: 24 * 60 * 60 * 1000, // 1 ден
//   //     path: '/',
//   //   });

//   //   // Возвращаем access_token для клиентской стороны
//   //   return res.json({ access_token });
//   // }
//   @Post('login')
//   async login(@Body() loginDto: any, @Res() res: Response) {
//     const user = await this.authService.validateUser(
//       loginDto.username,
//       loginDto.password,
//     );

//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const { access_token, refresh_token, session_id } =
//       await this.authService.login(user);

//     // Устанавливаем sessionId в куки
//     res.cookie('sessionId', session_id, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       maxAge: 24 * 60 * 60 * 1000, // 1 день
//       path: '/',
//     });
//     // Устанавливаем refresh_token в куки
//     res.cookie('refresh_token', refresh_token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       maxAge: 24 * 60 * 60 * 1000, // 1 день
//       path: '/',
//     });

//     // Возвращаем access_token клиенту
//     return res.json({ access_token });
//   }
//   // @Post('login')
//   // async login(@Body() loginDto: any, @Res() res: Response) {
//   //   try {
//   //     const { access_token, refresh_token } =
//   //       await this.authService.login(loginDto);

//   //     // ИЗМЕНИЛ ЗДЕСЬ: Устанавливаем refresh_token в куку с нужными параметрами
//   //     res.cookie('refresh_token', refresh_token, {
//   //       httpOnly: true, // Защита куки от JavaScript
//   //       secure: false, // ИЗМЕНИЛ ЗДЕСЬ: Используйте false для локальной разработки, true для продакшн
//   //       sameSite: 'lax', // ИЗМЕНИЛ ЗДЕСЬ: Использовать 'Lax' для кросс-доменных запросов
//   //       maxAge: 24 * 60 * 60 * 1000, // 1 день
//   //     });

//   //     return res.status(HttpStatus.OK).json({
//   //       access_token,
//   //       user: { username: loginDto.username },
//   //     });
//   //   } catch (error) {
//   //     return res.status(HttpStatus.UNAUTHORIZED).json({
//   //       message: 'Invalid credentials',
//   //     });
//   //   }
//   // }

//   @Post('refresh')
//   async refresh(@Req() req: Request, @Res() res: Response) {
//     const sessionId = req.cookies['sessionId'];
//     const refreshToken = req.cookies['refresh_token'];

//     if (!refreshToken || !sessionId) {
//       throw new UnauthorizedException('Refresh token is required');
//     }
//     const updatedSession = await this.authService.refreshUsersSession(
//       sessionId,
//       refreshToken,
//     );

//     res.cookie('sessionId', updatedSession.id, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       maxAge: 24 * 60 * 60 * 1000,
//       path: '/',
//     });

//     res.cookie('refresh_token', updatedSession.refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production', // ИСПРАВИЛ ЗДЕСЬ: ОСТАВИЛ УСЛОВИЕ ДЛЯ ПРОДА И РАЗРАБОТКИ
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Обеспечение работы куков как в проде, так и локально
//       maxAge: 24 * 60 * 60 * 1000, // 1 день
//       path: '/',
//     });
//     console.log('Обновленные куки: sessionId и refresh_token');

//     // Возвращаем новый access_token клиенту
//     return res.json({ access_token: updatedSession.accessToken });
//   }

//   @Post('logout')
//   // @UseGuards(JwtAuthGuard)
//   @UseGuards(OptionalJwtAuthGuard)
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async logout(@Req() req: Request, @Res() res: Response) {
//     console.log('Запрос на логаут получен');
//     console.log('Пользователь в req.user:', req.user);
//     // Логи для дебага
//     console.log('Cookies в запросе:', req.cookies);
//     console.log('Заголовки в запросе:', req.headers);

//     const sessionId = req.cookies['sessionId'];
//     const refreshToken = req.cookies['refresh_token'];

//     if (!refreshToken || !sessionId) {
//       console.error('Не удалось найти refresh_token в куках');
//       throw new UnauthorizedException('Refresh token is required');
//     }
//     await this.authService.logout(sessionId, refreshToken);
//     res.clearCookie('sessionId', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       path: '/',
//     });

//     res.clearCookie('refresh_token', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production', // ИСПРАВИЛ ЗДЕСЬ: ОСТАВИЛ УСЛОВИЕ ДЛЯ ПРОДА И РАЗРАБОТКИ
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Обеспечение работы куков как в проде, так и локально
//       path: '/',
//     });
//     // return res.send();
//     return res.status(HttpStatus.NO_CONTENT).send();
//   }
//   // Новый метод для получения информации о текущем пользователе
//   @UseGuards(JwtAuthGuard) // Используем guard для защиты этого маршрута
//   @Get('me')
//   async getCurrentUser(@Req() req: Request) {
//     const user = req.user; // req.user будет содержать информацию о пользователе, если JwtAuthGuard успешно отработал
//     console.log('Текущий пользователь вот (req.user):', req.user);
//     return this.authService.getCurrentUser(user);
//   }
// }
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const user = req.user;
    console.log('Текущий пользователь (req.user):', req.user);
    return this.authService.getCurrentUser(user);
  }
}
