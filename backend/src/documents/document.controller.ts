// import {
//   Controller,
//   Get,
//   Post,
//   Patch,
//   Delete,
//   Param,
//   Body,
//   UploadedFile,
//   UseInterceptors,
//   UseGuards,
//   Req,
// } from '@nestjs/common';
// import { DocumentService } from './document.service';
// import { CreateDocumentDto } from './dto/create-document.dto';
// import { UpdateDocumentDto } from './dto/create-document.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Role } from '../auth/decorators/roles.decorator';
// import { Request } from 'express';
// import * as path from 'path';

// @Controller('documents')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class DocumentController {
//   constructor(private readonly documentService: DocumentService) {}

//   @Post()
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads/documents',
//         filename: (req, file, callback) => {
//           const uniqueSuffix =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const ext = extname(file.originalname);
//           callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//         },
//       }),
//     }),
//   )
//   async create(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() createDocumentDto: CreateDocumentDto,
//     @Req() req: Request,
//   ): Promise<any> {
//     const user = req.user;
//     const fullPath = path.resolve(file.path);
//     console.log('Full file path:', fullPath);
//     console.log('File name:', file.originalname);
//     return await this.documentService.create(createDocumentDto, fullPath, user);
//   }

//   @Role('admin')
//   @Get()
//   async findAll(): Promise<any> {
//     return await this.documentService.findAll();
//   }

//   @Get('my')
//   async findAllUserDocuments(@Req() req: Request): Promise<any> {
//     const user = req.user;
//     return await this.documentService.findAllUserDocuments(user);
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: number, @Req() req: Request): Promise<any> {
//     const user = req.user;
//     return await this.documentService.findOne(id, user);
//   }

//   @Patch(':id')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads/documents',
//         filename: (req, file, callback) => {
//           const uniqueSuffix =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const ext = extname(file.originalname);
//           callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//         },
//       }),
//     }),
//   )
//   async update(
//     @Param('id') id: number,
//     @Body() updateDocumentDto: UpdateDocumentDto,
//     @Req() req: Request,
//     @UploadedFile() file?: Express.Multer.File,
//   ): Promise<any> {
//     const user = req.user;
//     const newFilePath = file ? path.resolve(file.path) : undefined;
//     if (newFilePath) {
//       console.log('New full file path:', newFilePath);
//       console.log('New file name:', file.originalname);
//     }
//     return await this.documentService.update(
//       id,
//       updateDocumentDto,
//       user,
//       newFilePath,
//     );
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: number, @Req() req: Request): Promise<void> {
//     const user = req.user;
//     return await this.documentService.remove(id, user);
//   }
// }
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
  Req,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { Request } from 'express';
import * as path from 'path';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard) // Используем Guards для всех маршрутов контроллера
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
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Req() req: Request,
  ): Promise<any> {
    const user = req.user;
    // Логируем пользователя для диагностики
    console.log('User from request:', user);
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }

    console.log('User ID:', user.id); // Логируем ID пользователя
    const fullPath = path.resolve(file.path);
    console.log('Full file path:', fullPath);
    console.log('File name:', file.originalname);

    return await this.documentService.create(createDocumentDto, fullPath, user);
  }

  // Получение всех документов (только для администратора)
  @Role('admin') // Теперь этот маршрут доступен только для пользователей с ролью 'admin'
  @Get()
  async findAll(@Req() req: Request): Promise<any> {
    const user = req.user;

    // Логирование для диагностики
    console.log('User trying to get all documents:', user);

    // Если пользователь не является администратором, то выбрасываем ошибку
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Access denied. Only admin can view all documents.',
      );
    }

    return await this.documentService.findAll();
  }

  // Получение всех документов текущего пользователя
  @Get('my')
  async findAllUserDocuments(@Req() req: Request): Promise<any> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }

    console.log('User ID for finding all documents:', user.id); // Логируем ID пользователя
    return await this.documentService.findAllUserDocuments(user);
  }

  // Получение конкретного документа по ID
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req: Request): Promise<any> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }

    console.log('Finding document with ID:', id, 'by User ID:', user.id); // Логируем ID документа и ID пользователя
    return await this.documentService.findOne(id, user);
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
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }

    console.log('Updating document with ID:', id, 'by User ID:', user.id); // Логируем ID документа и ID пользователя
    const newFilePath = file ? path.resolve(file.path) : undefined;
    if (newFilePath) {
      console.log('New full file path:', newFilePath);
      console.log('New file name:', file.originalname);
    }

    return await this.documentService.update(
      id,
      updateDocumentDto,
      user,
      newFilePath,
    );
  }

  // Удаление документа
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: Request): Promise<void> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }

    console.log('Deleting document with ID:', id, 'by User ID:', user.id); // Логируем ID документа и ID пользователя
    return await this.documentService.remove(id, user);
  }
}
