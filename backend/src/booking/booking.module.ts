import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { MailerService } from '../mailer/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])], // Подключаем сущность Booking в TypeOrmModule
  controllers: [BookingController], // Указываем контроллер
  providers: [BookingService, MailerService], // Добавляем сервисы в providers
  exports: [BookingService], // Экспортируем BookingService, чтобы его можно было использовать в других модулях
})
export class BookingModule {}
