import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard) // Применяем Guard ко всему контроллеру
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // Загрузка нового документа
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          console.log(`${file.fieldname}-${uniqueSuffix}${ext}`);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<any> {
    console.log('Файл сохранён в:', file.path);
    // Возвращаем тип any, можно уточнить позже
    return await this.documentService.create(createDocumentDto, file.path);
  }

  // Получение всех документов
  @Get()
  async findAll(): Promise<any[]> {
    // Возвращаем массив с типом any
    return await this.documentService.findAll();
  }

  // Получение конкретного документа по ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return await this.documentService.findOne(id);
  }

  // Обновление документа, включая замену файла
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    const filePath = file ? file.path : undefined;
    return await this.documentService.update(id, updateDocumentDto, filePath);
  }

  // Удаление документа
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.documentService.remove(id);
  }
}
