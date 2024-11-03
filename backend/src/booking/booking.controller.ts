import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Создание нового бронирования
  @Post()
  async create(@Body() bookingData: Partial<Booking>): Promise<Booking> {
    return await this.bookingService.create(bookingData);
  }

  // Получение всех бронирований
  @Get()
  async findAll(): Promise<Booking[]> {
    return await this.bookingService.findAll();
  }

  // Получение конкретного бронирования по ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Booking> {
    return await this.bookingService.findOne(id);
  }

  // Обновление бронирования
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedBooking: Partial<Booking>,
  ): Promise<Booking> {
    return await this.bookingService.update(id, updatedBooking);
  }

  // Удаление бронирования
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.bookingService.remove(id);
  }
}
