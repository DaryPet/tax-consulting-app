import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { Document } from './enteties/document.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), UserModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
