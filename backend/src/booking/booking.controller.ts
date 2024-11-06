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
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { Request } from 'express';

@Controller('booking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Создание нового бронирования
  @Post()
  async create(
    @Body() bookingData: Partial<Booking>,
    @Req() req: Request,
  ): Promise<Booking> {
    const user = req.user;
    return await this.bookingService.create(bookingData, user);
  }

  // Получение всех бронирований (только для администратора)
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
  @Get('my')
  async findAllUserBookings(@Req() req: Request): Promise<Booking[]> {
    const user = req.user;
    return await this.bookingService.findAllUserBookings(user);
  }
  // Получение конкретного бронирования по ID
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<Booking> {
    const user = req.user;
    return await this.bookingService.findOne(id, user);
  }

  // Обновление бронирования
  // @Patch(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() updatedBooking: Partial<Booking>,
  // ): Promise<Booking> {
  //   return await this.bookingService.update(id, updatedBooking);
  // }
  // Обновление бронирования
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedBooking: Partial<Booking>,
    @Req() req: Request,
  ): Promise<Booking> {
    const user = req.user;
    return await this.bookingService.update(id, updatedBooking, user);
  }
  // // Удаление бронирования
  // @Delete(':id')
  // async remove(@Param('id') id: number): Promise<void> {
  //   return await this.bookingService.remove(id);
  // }
  // Удаление бронирования — пользователь может удалять только свои бронирования
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: Request): Promise<void> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }

    // Вызов метода удаления в сервисе
    return await this.bookingService.remove(id, user);
  }
}
