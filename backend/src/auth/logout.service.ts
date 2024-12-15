import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class LogoutService {
  constructor(private readonly usersService: UserService) {}

  async logoutUser(userId: number): Promise<void> {
    console.log(`Logging out user with ID: ${userId}`);
  }
}
