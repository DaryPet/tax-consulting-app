import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Эндпоинт для регистрации нового пользователя
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  // Эндпоинт для получения пользователя по ID
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.userService.findById(id);
  }

  // Эндпоинт для получения всех пользователей
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }
   @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return await this.userService.updateUser(id, updateData);
   }
  @Delete(':id')
async deleteUser(@Param('id') id: number): Promise<void> {
  return await this.userService.deleteUser(id);
}

}
