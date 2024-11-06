import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { MailerService } from '../mailer/mailer.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private mailerService: MailerService,
  ) {}

  // Создание нового бронирования
  async create(bookingData: Partial<Booking>, user: User): Promise<Booking> {
    const newBooking = this.bookingRepository.create({ ...bookingData, user });
    const savedBooking = await this.bookingRepository.save(newBooking);
    // Отправка email с подтверждением бронирования
    await this.mailerService.sendBookingConfirmation(savedBooking);

    return savedBooking;
  }

  // Получение всех бронирований (только для администратора)
  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({ relations: ['user'] });
  }
  // Получение всех бронирований текущего пользователя
  async findAllUserBookings(user: User): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  }
  // // Получение конкретного бронирования по ID
  // async findOne(id: number, user: User): Promise<Booking> {
  //   return await this.bookingRepository.findOneBy({
  //     where: { id },
  //     relations: ['user'],
  //   });
  // }
  // Получение конкретного бронирования по ID
  async findOne(id: number, user: User): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (user.role !== 'admin' && booking.user.id !== user.id) {
      throw new ForbiddenException('You can only access your own bookings.');
    }
    return booking;
  }

  // // Обновление бронирования
  // async update(id: number, updatedBooking: Partial<Booking>): Promise<Booking> {
  //   await this.bookingRepository.update(id, updatedBooking);
  //   return this.bookingRepository.findOneBy({ id });
  // }
  // Обновление бронирования
  async update(
    id: number,
    updatedBooking: Partial<Booking>,
    user: User,
  ): Promise<Booking> {
    const booking = await this.findOne(id, user);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    Object.assign(booking, updatedBooking);
    return await this.bookingRepository.save(booking);
  }

  // Удаление бронирования (пользователь может удалить только свои бронирования, админ — любые)
  async remove(id: number, user: User): Promise<void> {
    // Находим бронирование по ID
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Проверяем права доступа — пользователь может удалить только свое бронирование
    if (user.role !== 'admin' && booking.user.id !== user.id) {
      throw new ForbiddenException(
        'Access denied. You can only delete your own bookings.',
      );
    }

    // Если все проверки прошли, удаляем бронирование
    await this.bookingRepository.delete(id);
  }
}
