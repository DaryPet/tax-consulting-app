import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { Request } from 'express';
// import { Optional } from '@nestjs/common'; // Добавлен импорт для использования опционального параметра
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Get('available-slots')
  async findAvailableSlots(@Query('date') date: string): Promise<string[]> {
    return await this.bookingService.findAvailableSlots(date);
  }
  // Создание нового бронирования
  @Post()
  @UseGuards(OptionalJwtAuthGuard) // Используем модифицированный Guard, который не обязательно требует авторизации
  async create(
    @Body() bookingData: Partial<Booking>,
    @Req() req: Request,
  ): Promise<Booking> {
    // Если пользователь авторизован, берем из req.user
    const user = req.user ? req.user : null;
    return await this.bookingService.create(bookingData, user);
  }
  // Получение всех бронирований (только для администратора)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Get()
  async findAll(@Req() req: Request): Promise<Booking[]> {
    const user = req.user;
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Access denied. Only admin can view all documents.',
      );
    }
    return await this.bookingService.findAll();
  }
  // Получение всех бронирований текущего пользователя
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findAllUserBookings(@Req() req: Request): Promise<Booking[]> {
    const user = req.user;
    return await this.bookingService.findAllUserBookings(user);
  }
  // Получение конкретного бронирования по ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<Booking> {
    const user = req.user;
    return await this.bookingService.findOne(id, user);
  }
  @UseGuards(OptionalJwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Query('token') token: string,
    @Body() updatedBooking: Partial<Booking>,
    @Req() req: Request,
  ): Promise<Booking> {
    console.log('PATCH Request - User:', req.user); // Логируем для проверки
    // const user = req.user;
    const user = req.user ? req.user : null; // Пользователь может быть авторизован, либо null для неавторизованных
    return await this.bookingService.update(id, updatedBooking, user, token);
  }

  // Удаление бронирования — пользователь может удалять только свои бронирования
  @UseGuards(OptionalJwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Query('token') token: string,
    @Req() req: Request,
  ): Promise<void> {
    console.log('DELETE Request - User:', req.user); // Логируем для проверки
    const user = req.user ? req.user : null; // Пользователь может быть авторизован, либо null для неавторизованных
    // const user = req.user;
    return await this.bookingService.remove(id, user, token);
  }
}
