import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './enteties/document.entity';
import { UserService } from '../user/user.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/create-document.dto';
import * as fs from 'fs';
import * as path from 'path';
import { basename } from 'path';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private userService: UserService,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    filePath: string,
    // user: any,
    userId: number,
  ): Promise<Document> {
    const filename = basename(filePath);
    const fullPath = path.resolve(filePath);
    // Логируем для диагностики
    console.log('Creating document for user ID:', userId);
    console.log('Full file path:', fullPath);
    console.log('File name:', filename);
    // Находим пользователя, которому предназначен документ
    const targetUser = await this.userService.findById(userId);
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }
    // Логируем для диагностики
    console.log('Target User:', targetUser);
    console.log('Creating document for user ID:', userId);
    // Создаем новый экземпляр документа вручную
    const newDocument = new Document();
    newDocument.filename = filename;
    newDocument.filepath = fullPath;
    newDocument.uploadedBy = targetUser; // Явно устанавливаем связь с целевым пользователем
    newDocument.description = createDocumentDto.description;
    console.log('New Document:', newDocument); // Логируем созданный документ для диагностики
    return await this.documentRepository.save(newDocument);
  }

  async findAll(): Promise<Document[]> {
    return await this.documentRepository.find({ relations: ['uploadedBy'] });
  }

  async findAllUserDocuments(user: any): Promise<Document[]> {
    return await this.documentRepository.find({
      where: { uploadedBy: { id: user.id } },
      relations: ['uploadedBy'],
    });
  }

  async findOne(id: number, user: any): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    // Проверка прав доступа
    if (user.role !== 'admin' && document.uploadedBy.id !== user.id) {
      console.log(
        `Document ID: ${document.id}, Owner ID: ${document.uploadedBy.id}, Requester ID: ${user.id}`,
      );
      throw new ForbiddenException(
        'Access denied. You can only view your own documents.',
      );
    }

    return document;
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
    user: any,
    newFilePath?: string,
  ): Promise<Document> {
    const document = await this.findOne(id, user);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    if (newFilePath) {
      const fullPath = path.resolve(newFilePath);
      console.log('Updated full file path:', fullPath);
      console.log('Updated file name:', basename(fullPath));
      if (document.filepath && fs.existsSync(document.filepath)) {
        fs.unlinkSync(document.filepath);
      }
      document.filepath = fullPath;
      document.filename = basename(fullPath);
    }
    Object.assign(document, updateDocumentDto);
    return await this.documentRepository.save(document);
  }

  async remove(id: number, user: any): Promise<void> {
    const document = await this.findOne(id, user);
    if (document.filepath && fs.existsSync(document.filepath)) {
      fs.unlinkSync(document.filepath);
    }
    await this.documentRepository.delete(id);
  }
}
