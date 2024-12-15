import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { MailerService } from '../mailer/mailer.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User])],
  controllers: [BookingController],
  providers: [BookingService, MailerService],
  exports: [BookingService],
})
export class BookingModule {}
