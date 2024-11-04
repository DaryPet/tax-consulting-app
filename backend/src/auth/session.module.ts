import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './enteties/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  exports: [TypeOrmModule], // Экспортируем TypeOrmModule, чтобы он был доступен в других модулях
})
export class SessionModule {}
