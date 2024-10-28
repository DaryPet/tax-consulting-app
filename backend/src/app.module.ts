
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller'; // Импортируем AppController
import { AppService } from './app.service';       // Импортируем AppService
import { TestimonialModule } from './testimonial/testimonial.module';
import { DocumentModule } from './document/document.module';
import { UserModule } from './user/user.module'; // Добавляем UserModule
// import { BookingModule } from './booking/booking.module'; // Добавляем BookingModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Тип базы данных
      host: 'localhost', // Хост, так как база данных на локальной машине
      port: 5432, // Порт (или тот, который ты выбрала при установке PostgreSQL)
      username: 'tax_user', // Имя пользователя, которое ты создала в PostgreSQL
      password: '12345', // Пароль пользователя
      database: 'tax_consulting', // Название базы данных
      autoLoadEntities: true, // Автоматически загружать сущности
      synchronize: true, // Синхронизация схемы базы данных (создание таблиц автоматически)
    }),
    TestimonialModule,
    DocumentModule,
    UserModule,   // Подключаем UserModule
    // BookingModule // Подключаем BookingModule
  ],
  controllers: [AppController], // Добавляем AppController
  providers: [AppService],      // Добавляем AppService
})
export class AppModule {}
