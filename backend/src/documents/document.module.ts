// backend/src/documents/document.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Document } from './enteties/document.entity';
import { UserModule } from '../user/user.module'; // Импортируем UserModule

@Module({
  imports: [TypeOrmModule.forFeature([Document]), UserModule], // Подключаем сущность Document к TypeOrmModule
  controllers: [DocumentController], // Контроллер для управления документами
  providers: [DocumentService], // Сервис для логики документа
})
export class DocumentModule {}
