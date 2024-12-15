import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<User> {
    const user = req.user;
    if (user.role !== 'admin' && user.id !== id) {
      throw new ForbiddenException(
        'Access denied. You can only view your own data.',
      );
    }

    return await this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
    @Req() req: Request,
  ): Promise<User> {
    const user = req.user;
    if (user.role !== 'admin' && user.id !== id) {
      throw new ForbiddenException(
        'Access denied. You can only update your own data.',
      );
    }

    return await this.userService.updateUser(id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return await this.userService.deleteUser(id);
  }
}
