// import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from './auth.service';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   async login(@Body() body: { username: string; password: string }) {
//     const user = await this.authService.validateUser(
//       body.username,
//       body.password,
//     );
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     return this.authService.login(user);
//   }
// }
// File: src/auth/auth.controller.ts

// import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateUserDto } from '../user/dto/create-user.dto'; // Импортируем DTO для пользователя

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   async login(@Body() body: { username: string; password: string }) {
//     const user = await this.authService.validateUser(
//       body.username,
//       body.password,
//     );
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     return this.authService.login(user);
//   }

//   @Post('register') // Новый эндпоинт для регистрации
//   async register(@Body() createUserDto: CreateUserDto) {
//     return this.authService.register(createUserDto);
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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body() body: any) {
    const { refreshToken } = body;
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() body: any) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    await this.authService.logout(refreshToken);
  }
}
