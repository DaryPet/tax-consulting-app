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
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Get('available-slots')
  async findAvailableSlots(@Query('date') date: string): Promise<string[]> {
    return await this.bookingService.findAvailableSlots(date);
  }
  @Post()
  // @UseGuards(OptionalJwtAuthGuard)
  async create(
    @Body() bookingData: Partial<Booking>,
    @Req() req: Request,
  ): Promise<Booking> {
    const user = req.user ? req.user : null;
    return await this.bookingService.create(bookingData, user);
  }

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

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findAllUserBookings(@Req() req: Request): Promise<Booking[]> {
    const user = req.user;
    return await this.bookingService.findAllUserBookings(user);
  }

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
    const user = req.user ? req.user : null;
    return await this.bookingService.update(id, updatedBooking, user, token);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Query('token') token: string,
    @Req() req: Request,
  ): Promise<void> {
    const user = req.user ? req.user : null;
    return await this.bookingService.remove(id, user, token);
  }
}
