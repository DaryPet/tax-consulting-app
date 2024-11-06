import {
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { LogoutService } from './logout.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class LogoutController {
  constructor(private readonly logoutService: LogoutService) {}

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    if (user) {
      await this.logoutService.logoutUser(user['userId']);
      // Очищаем куки, связанные с токенами
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(HttpStatus.NO_CONTENT).send();
    } else {
      res.status(HttpStatus.UNAUTHORIZED).send('User not authenticated');
    }
  }
}
