import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private mailerService: MailerService,
  ) {}

  // Создание нового бронирования
  async create(bookingData: Partial<Booking>): Promise<Booking> {
    const newBooking = this.bookingRepository.create(bookingData);
    const savedBooking = await this.bookingRepository.save(newBooking);
    // Отправка email с подтверждением бронирования
    await this.mailerService.sendBookingConfirmation(savedBooking);

    return savedBooking;
  }

  // Получение всех бронирований
  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find();
  }

  // Получение конкретного бронирования по ID
  async findOne(id: number): Promise<Booking> {
    return await this.bookingRepository.findOneBy({ id });
  }

  // Обновление бронирования
  async update(id: number, updatedBooking: Partial<Booking>): Promise<Booking> {
    await this.bookingRepository.update(id, updatedBooking);
    return this.bookingRepository.findOneBy({ id });
  }

  // Удаление бронирования
  async remove(id: number): Promise<void> {
    await this.bookingRepository.delete(id);
  }
}
