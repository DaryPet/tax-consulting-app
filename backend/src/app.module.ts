import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { BookingModule } from './booking/booking.module';
import { DocumentModule } from './documents/document.module';

console.log('Загрузка AppModule');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Используем строку подключения из переменных окружения
      // host: 'localhost',
      // port: 5432,
      // username: 'tax_user',
      // password: '12345',
      // database: 'tax_consulting',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    BookingModule,
    UserModule,
    AuthModule,
    TestimonialModule,
    DocumentModule,
  ],
})
export class AppModule {}
