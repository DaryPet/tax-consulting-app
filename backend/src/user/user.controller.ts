// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   Param,
//   Patch,
//   Delete,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { AuthService } from '../auth/auth.service';
// import { LoginDto } from './dto/login.dto.js';

// @Controller('users')
// export class UserController {
//   constructor(
//     private readonly userService: UserService,
//     private readonly authService: AuthService,
//   ) {}

//   // Эндпоинт для регистрации нового пользователя
//   @Post('register')
//   async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
//     return await this.userService.create(createUserDto);
//   }
//   // для логину
//   @Post('login')
//   async loginUser(
//     @Body() loginDto: LoginDto,
//   ): Promise<{ access_token: string }> {
//     const user = await this.authService.validateUser(
//       loginDto.username,
//       loginDto.password,
//     );
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     return this.authService.login(user);
//   }
//   // Эндпоинт для получения пользователя по ID
//   @Get(':id')
//   async getUserById(@Param('id') id: number): Promise<User> {
//     return await this.userService.findById(id);
//   }

//   // Эндпоинт для получения всех пользователей
//   @Get()
//   async getAllUsers(): Promise<User[]> {
//     return await this.userService.findAll();
//   }
//   @Patch(':id')
//   async updateUser(
//     @Param('id') id: number,
//     @Body() updateData: Partial<User>,
//   ): Promise<User> {
//     return await this.userService.updateUser(id, updateData);
//   }
//   @Delete(':id')
//   async deleteUser(@Param('id') id: number): Promise<void> {
//     return await this.userService.deleteUser(id);
//   }
// }
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.userService.findById(id);
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
