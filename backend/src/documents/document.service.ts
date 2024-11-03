// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Document } from './enteties/document.entity';
// import { CreateDocumentDto } from './dto/create-document.dto';
// import { UpdateDocumentDto } from './dto/create-document.dto';
// import * as fs from 'fs';

// @Injectable()
// export class DocumentService {
//   constructor(
//     @InjectRepository(Document)
//     private documentRepository: Repository<Document>,
//   ) {}

//   async create(
//     createDocumentDto: CreateDocumentDto,
//     filePath: string,
//   ): Promise<Document> {
//     // Извлекаем имя файла из пути к файлу
//     const filename = filePath.split('/').pop(); // Получаем только имя файла из пути

//     const newDocument = this.documentRepository.create({
//       ...createDocumentDto,
//       filename, // Устанавливаем имя файла автоматически
//       filepath: filePath,
//     });
//     return await this.documentRepository.save(newDocument);
//   }

//   async findAll(): Promise<Document[]> {
//     return await this.documentRepository.find();
//   }

//   async findOne(id: number): Promise<Document> {
//     const document = await this.documentRepository.findOne({ where: { id } });
//     if (!document) {
//       throw new NotFoundException('Document not found');
//     }
//     return document;
//   }

//   async update(
//     id: number,
//     updateDocumentDto: UpdateDocumentDto,
//     newFilePath?: string,
//   ): Promise<Document> {
//     const document = await this.findOne(id);
//     if (!document) {
//       throw new NotFoundException('Document not found');
//     }

//     if (newFilePath) {
//       if (document.filepath) {
//         fs.unlinkSync(document.filepath);
//       }
//       document.filepath = newFilePath;
//       document.filename = newFilePath.split('/').pop(); // Обновляем имя файла, если файл изменён
//     }

//     Object.assign(document, updateDocumentDto);
//     return await this.documentRepository.save(document);
//   }

//   async remove(id: number): Promise<void> {
//     const document = await this.findOne(id);
//     if (document && document.filepath) {
//       fs.unlinkSync(document.filepath);
//     }
//     await this.documentRepository.delete(id);
//   }
// }
// backend/src/documents/document.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './enteties/document.entity.js';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/create-document.dto.js';
import * as fs from 'fs';
import { basename } from 'path';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  //   async create(
  //     createDocumentDto: CreateDocumentDto,
  //     filePath: string,
  //   ): Promise<Document> {
  //     const filename = basename(filePath); // Извлекаем имя файла из пути
  //     console.log(filename);

  //     const newDocument = this.documentRepository.create({
  //       ...createDocumentDto,
  //       filename: filename, // Устанавливаем имя файла
  //       console.log(filename),
  //       filepath: filePath,
  //     });

  //     return await this.documentRepository.save(newDocument);
  //   }
  async create(
    createDocumentDto: CreateDocumentDto,
    filePath: string,
  ): Promise<Document> {
    // Извлекаем имя файла из полного пути
    const filename = basename(filePath);

    // Выводим значения в консоль для диагностики
    console.log('filePath:', filePath); // Должен быть полный путь к файлу
    console.log('filename:', filename); // Должно быть только имя файла
    console.log('DTO data:', createDocumentDto); // Должно содержать данные из DTO

    // Создаем новый объект Document с использованием данных из DTO и дополнительной информацией
    const newDocument = this.documentRepository.create({
      ...createDocumentDto,
      filename: filename,
      filepath: filePath,
    });

    // Выводим данные перед сохранением для проверки
    console.log('New document data before saving:', newDocument);

    // Сохраняем объект в базе данных
    return await this.documentRepository.save(newDocument);
  }

  async findAll(): Promise<Document[]> {
    return await this.documentRepository.find();
  }

  async findOne(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
    newFilePath?: string,
  ): Promise<Document> {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (newFilePath) {
      if (document.filepath) {
        fs.unlinkSync(document.filepath); // Удаляем старый файл
      }
      document.filepath = newFilePath;
      document.filename = basename(newFilePath); // Обновляем имя файла, если файл изменён
    }

    Object.assign(document, updateDocumentDto);
    return await this.documentRepository.save(document);
  }

  async remove(id: number): Promise<void> {
    const document = await this.findOne(id);
    if (document && document.filepath) {
      fs.unlinkSync(document.filepath); // Удаляем файл из системы
    }
    await this.documentRepository.delete(id); // Удаляем запись из базы данных
  }
}
