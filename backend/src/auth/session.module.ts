import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './enteties/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  exports: [TypeOrmModule],
})
export class SessionModule {}
