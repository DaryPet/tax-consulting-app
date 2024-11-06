// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Document } from './enteties/document.entity.js';
// import { UserService } from '../user/user.service'; // Используем UserService для доступа к пользователям
// // import { User } from '../user/entities/user.entity'; // Импортируем сущность User
// import { CreateDocumentDto } from './dto/create-document.dto';
// import { UpdateDocumentDto } from './dto/create-document.dto.js';
// import * as fs from 'fs';
// import { basename } from 'path';

// @Injectable()
// export class DocumentService {
//   constructor(
//     @InjectRepository(Document)
//     private documentRepository: Repository<Document>,
//     private userService: UserService, // Используем UserService
//   ) {}

//   //   async create(
//   //     createDocumentDto: CreateDocumentDto,
//   //     filePath: string,
//   //   ): Promise<Document> {
//   //     const filename = basename(filePath); // Извлекаем имя файла из пути
//   //     console.log(filename);

//   //     const newDocument = this.documentRepository.create({
//   //       ...createDocumentDto,
//   //       filename: filename, // Устанавливаем имя файла
//   //       console.log(filename),
//   //       filepath: filePath,
//   //     });

//   //     return await this.documentRepository.save(newDocument);
//   //   }
//   async create(
//     createDocumentDto: CreateDocumentDto,
//     filePath: string,
//     user: any,
//   ): Promise<Document> {
//     // Извлекаем имя файла из полного пути
//     const filename = basename(filePath);

//     // Выводим значения в консоль для диагностики
//     console.log('filePath:', filePath); // Должен быть полный путь к файлу
//     console.log('filename:', filename); // Должно быть только имя файла
//     console.log('DTO data:', createDocumentDto); // Должно содержать данные из DTO

//     // Найдите пользователя по его ID
//     const currentUser = await this.userService.findById(user.userId);
//     if (!currentUser) {
//       throw new NotFoundException('User not found');
//     }
//     // Создаем новый объект Document с использованием данных из DTO и дополнительной информацией
//     const newDocument = this.documentRepository.create({
//       ...createDocumentDto,
//       filename,
//       filepath: filePath,
//       uploadedBy: currentUser,
//     });

//     // Выводим данные перед сохранением для проверки
//     console.log('New document data before saving:', newDocument);

//     // Сохраняем объект в базе данных
//     return await this.documentRepository.save(newDocument);
//   }

//   async findAll(): Promise<Document[]> {
//     return await this.documentRepository.find({ relations: ['uploadedBy'] });
//   }

//   async findOne(id: number, user: any): Promise<Document> {
//     const document = await this.documentRepository.findOne({
//       where: { id },
//       relations: ['uploadedBy'],
//     });
//     if (!document) {
//       throw new NotFoundException('Document not found');
//     }
//     // Проверка прав доступа: админ или владелец документа
//     if (user.role !== 'admin' && document.uploadedBy.id !== user.id) {
//       throw new ForbiddenException(
//         'Access denied. You can only view your own documents.',
//       );
//     }
//     return document;
//   }

//   async update(
//     id: number,
//     updateDocumentDto: UpdateDocumentDto,
//     user: any,
//     newFilePath?: string,
//   ): Promise<Document> {
//     const document = await this.findOne(id, user);
//     if (!document) {
//       throw new NotFoundException('Document not found');
//     }

//     if (newFilePath) {
//       if (document.filepath) {
//         fs.unlinkSync(document.filepath); // Удаляем старый файл
//       }
//       document.filepath = newFilePath;
//       document.filename = basename(newFilePath); // Обновляем имя файла, если файл изменён
//     }

//     Object.assign(document, updateDocumentDto);
//     return await this.documentRepository.save(document);
//   }

//   async remove(id: number, user: any): Promise<void> {
//     const document = await this.findOne(id, user);
//     // if (document && document.filepath) {
//     //   fs.unlinkSync(document.filepath); // Удаляем файл из системы
//     // }
//     if (document.filepath && fs.existsSync(document.filepath)) {
//       fs.unlinkSync(document.filepath);
//     }
//     await this.documentRepository.delete(id); // Удаляем запись из базы данных
//   }
// }
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
    user: any,
  ): Promise<Document> {
    const filename = basename(filePath);
    const fullPath = path.resolve(filePath);
    // Логируем для диагностики
    console.log('Creating document for user ID:', user.id);

    console.log('Full file path:', fullPath);
    console.log('File name:', filename);
    // const currentUser = await this.userService.findById(user.userId);
    // if (!currentUser) {
    //   throw new NotFoundException('User not found');
    // }
    const newDocument = this.documentRepository.create({
      ...createDocumentDto,
      filename,
      filepath: fullPath,
      uploadedBy: user,
    });
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
