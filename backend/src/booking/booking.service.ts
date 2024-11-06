import { randomBytes } from 'crypto';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  // Фиксированный список доступных временных интервалов в течение рабочего дня
  private readonly availableTimeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];
  // Новый метод для проверки доступности временного интервала
  private async isTimeSlotAvailable(
    date: string,
    time: string,
  ): Promise<boolean> {
    const existingBooking = await this.bookingRepository.findOne({
      where: { date, time },
    });
    return !existingBooking;
  }

  // Создание нового бронирования
  // async create(bookingData: Partial<Booking>, user?: User): Promise<Booking> {
  //   // Генерация уникального токена для бронирования
  //   const uniqueToken = randomBytes(16).toString('hex');

  //   // Проверка на выходные
  //   const bookingDate = new Date(bookingData.date);
  //   const isWeekend = bookingDate.getDay() === 0 || bookingDate.getDay() === 6;
  //   if (isWeekend) {
  //     throw new BadRequestException('Booking is not allowed on weekends.');
  //   }

  //   // Проверяем, является ли время допустимым
  //   if (!this.availableTimeSlots.includes(bookingData.time)) {
  //     throw new BadRequestException(
  //       'The selected time is not available for booking.',
  //     );
  //   }

  //   const isAvailable = await this.isTimeSlotAvailable(
  //     bookingData.date,
  //     bookingData.time,
  //   );
  //   if (!isAvailable) {
  //     throw new BadRequestException('Selected time slot is already taken.');
  //   }
  //   // Если пользователь указан, находим его в базе данных, чтобы гарантировать правильную сущность User
  //   let foundUser: User = null;
  //   console.log(foundUser);
  //   if (user) {
  //     foundUser = await this.userRepository.findOne({ where: { id: user.id } });
  //     if (!foundUser) {
  //       throw new NotFoundException('User not found');
  //     }
  //   }
  //   const newBooking = this.bookingRepository.create({
  //     ...bookingData,
  //     user: foundUser,
  //     uniqueToken,
  //   });
  //   console.log(newBooking);
  //   // const newBooking = this.bookingRepository.create({ ...bookingData, user });
  //   const savedBooking = await this.bookingRepository.save(newBooking);
  //   const manageLink = `https://yourapp.com/manage-booking/${savedBooking.id}?token=${savedBooking.uniqueToken}`;
  //   await this.mailerService.sendBookingConfirmation(savedBooking, manageLink);
  //   return savedBooking;
  // }
  async create(bookingData: Partial<Booking>, user?: User): Promise<Booking> {
    const uniqueToken = randomBytes(16).toString('hex');

    // Проверка на выходные и другие условия
    const bookingDate = new Date(bookingData.date);
    const isWeekend = bookingDate.getDay() === 0 || bookingDate.getDay() === 6;
    if (isWeekend) {
      throw new BadRequestException('Booking is not allowed on weekends.');
    }

    if (!this.availableTimeSlots.includes(bookingData.time)) {
      throw new BadRequestException(
        'The selected time is not available for booking.',
      );
    }

    const isAvailable = await this.isTimeSlotAvailable(
      bookingData.date,
      bookingData.time,
    );
    if (!isAvailable) {
      throw new BadRequestException('Selected time slot is already taken.');
    }

    // Создаем бронирование, при этом если user не предоставлен (неавторизованный пользователь), поле user будет null
    const newBooking = this.bookingRepository.create({
      ...bookingData,
      user: user ? user : null, // Если user передан, используем его, иначе null
      uniqueToken,
    });

    const savedBooking = await this.bookingRepository.save(newBooking);
    const manageLink = `https://yourapp.com/manage-booking/${savedBooking.id}?token=${savedBooking.uniqueToken}`;

    // Отправляем email с подтверждением
    await this.mailerService.sendBookingConfirmation(savedBooking, manageLink);

    return savedBooking;
  }

  // Получение доступных слотов (все, кроме занятых)
  async findAvailableSlots(date: string): Promise<string[]> {
    // Получаем все забронированные слоты на указанную дату
    const bookedSlots = await this.bookingRepository.find({
      where: { date },
    });

    const bookedTimes = bookedSlots.map((booking) => booking.time);

    // Находим все свободные временные интервалы
    const availableSlots = this.availableTimeSlots.filter(
      (time) => !bookedTimes.includes(time),
    );

    return availableSlots;
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

  async findOne(id: number, user?: User, token?: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Проверяем права доступа для авторизованных пользователей
    if (user) {
      if (user.role !== 'admin' && booking.user?.id !== user.id) {
        throw new ForbiddenException('You can only access your own bookings.');
      }
    }
    // Проверяем права доступа для неавторизованных пользователей, использующих токен
    else if (token && booking.uniqueToken !== token) {
      throw new ForbiddenException('Invalid booking token.');
    }
    // Если ни пользователь, ни токен не предоставлены
    else if (!user && !token) {
      throw new ForbiddenException('Authorization required.');
    }

    return booking;
  }
  // async update(
  //   id: number,
  //   updatedBooking: Partial<Booking>,
  //   user?: User,
  //   token?: string,
  // ): Promise<Booking> {
  //   const booking = await this.findOne(id, user, token);
  //   if (updatedBooking.date && updatedBooking.time) {
  //     const isAvailable = await this.isTimeSlotAvailable(
  //       updatedBooking.date,
  //       updatedBooking.time,
  //     );
  //     if (!isAvailable) {
  //       throw new BadRequestException('Selected time slot is already taken.');
  //     }
  //   }

  //   Object.assign(booking, updatedBooking);
  //   return await this.bookingRepository.save(booking);
  // }
  async update(
    id: number,
    updatedBooking: Partial<Booking>,
    user?: User,
    token?: string,
  ): Promise<Booking> {
    const booking = await this.findOne(id, user, token);

    // Проверка прав доступа
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (user) {
      // Проверяем, что пользователь является владельцем бронирования или администратором
      if (user.role !== 'admin' && booking.user?.id !== user.id) {
        throw new ForbiddenException('You can only update your own bookings.');
      }
    } else if (token && booking.uniqueToken !== token) {
      throw new ForbiddenException('Invalid booking token.');
    } else if (!user && !token) {
      throw new ForbiddenException('Authorization required.');
    }

    if (updatedBooking.date && updatedBooking.time) {
      const isAvailable = await this.isTimeSlotAvailable(
        updatedBooking.date,
        updatedBooking.time,
      );
      if (!isAvailable) {
        throw new BadRequestException('Selected time slot is already taken.');
      }
    }

    Object.assign(booking, updatedBooking);
    return await this.bookingRepository.save(booking);
  }

  // Удаление бронирования
  async remove(id: number, user?: User, token?: string): Promise<void> {
    const booking = await this.findOne(id, user, token);
    await this.bookingRepository.delete(booking.id);
  }
}
