import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Импорт сущности пользователя
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Подключаем сущность к TypeORM
  controllers: [UserController],              // Подключаем контроллер
  providers: [UserService],                   // Подключаем сервис
})
export class UserModule {}
