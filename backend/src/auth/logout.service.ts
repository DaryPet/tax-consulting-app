// src/auth/logout.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js'; // Заменить на вашу службу пользователей, если другая

@Injectable()
export class LogoutService {
  constructor(private readonly usersService: UserService) {}

  async logoutUser(userId: number): Promise<void> {
    // Здесь можно добавить логику для удаления refresh токена или сессии из базы данных, если требуется
    console.log(`Logging out user with ID: ${userId}`);
    // Например, удаление записи сессии в базе данных (если есть)
  }
}
