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
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const role = createUserDto.role || 'user';

    const user = await this.authService.register({
      ...createUserDto,
      role,
    });

    const { access_token, refresh_token, session_id } = user;

    res.cookie('sessionId', session_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.json({
      access_token,
      refresh_token,
      session_id,
      user,
    });
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
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    console.log('Куки установлены: sessionId и refresh_token');
    return res.json({ access_token });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.cookies.sessionId;
    const refreshToken = req.cookies.refresh_token;
    const updatedSession = await this.authService.refreshUserSession(
      sessionId,
      refreshToken,
    );

    res.cookie('sessionId', updatedSession.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.cookie('refresh_token', updatedSession.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
    if (!res.getHeader('Set-Cookie')) {
      console.error('Error:Cookie');
    }
    return res.json({ access_token: updatedSession.accessToken });
  }

  @Post('logout')
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.cookies.sessionId;
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken || !sessionId) {
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
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    if (!req.headers.authorization) {
      console.error('Authorization header is missing');
    }

    if (!req.cookies.refresh_token) {
      console.error('Refresh token is missing in cookies');
    }
    const currentSession = await this.authService.getSessionById(
      req.cookies.sessionId,
    );
    if (!currentSession.userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const currentUser = await this.authService.getCurrentUser(
      currentSession.userId,
    );

    return currentUser;
  }
}
