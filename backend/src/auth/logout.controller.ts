// src/auth/logout.controller.ts
import {
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { LogoutService } from './logout.service';
import { JwtAuthGuard } from './jwt-auth.guard'; // Заменить на ваш Guard
import { Request, Response } from 'express';

@Controller('auth')
export class LogoutController {
  constructor(private readonly logoutService: LogoutService) {}

  @UseGuards(JwtAuthGuard) // Проверка, что пользователь авторизован
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user; // Доступ к текущему авторизованному пользователю

      if (user) {
        await this.logoutService.logoutUser(user['userId']); // Вызываем сервис для завершения сессии

        // Очистка куки
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(HttpStatus.NO_CONTENT).send();
      } else {
        res.status(HttpStatus.UNAUTHORIZED).send('User not authenticated');
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Logout failed');
    }
  }
}
