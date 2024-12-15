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
  Res,
  NotFoundException,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { Request, Response } from 'express';
import { saveFileToCloudinary } from '../utils/saveFilesToCloudinary';
import * as multer from 'multer';
import axios from 'axios';
import * as mime from 'mime-types';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Req() req: Request,
  ): Promise<any> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }

    let targetUserId = user.id;
    if (user.role === 'admin' && createDocumentDto.userId) {
      targetUserId = createDocumentDto.userId;
    }

    if (!file) {
      throw new Error('File is missing from the request');
    }

    let fileUrl: string;

    try {
      fileUrl = await saveFileToCloudinary(file, file.originalname);
    } catch (error) {
      console.error('Error while uploading to Cloudinary:', error);
      throw new Error('Failed to upload file to Cloudinary');
    }

    return await this.documentService.create(
      createDocumentDto,
      fileUrl,
      targetUserId,
      file.originalname,
    );
  }

  @Role('admin')
  @Get()
  async findAll(@Req() req: Request): Promise<any> {
    const user = req.user;
    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'Access denied. Only admin can view all documents.',
      );
    }

    return await this.documentService.findAll();
  }

  @Get('my')
  async findAllUserDocuments(@Req() req: Request): Promise<any> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }

    return await this.documentService.findAllUserDocuments(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req: Request): Promise<any> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }

    return await this.documentService.findOne(id, user);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
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

    let newFileUrl: string | undefined;

    if (file) {
      try {
        newFileUrl = await saveFileToCloudinary(file, file.originalname);
      } catch (error) {
        throw new Error('Failed to upload updated file to Cloudinary');
      }
    }

    return await this.documentService.update(
      id,
      updateDocumentDto,
      user,
      newFileUrl,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: Request): Promise<void> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }

    return await this.documentService.remove(id, user);
  }

  @Get('download/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async downloadDocument(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }
    const document = await this.documentService.findOne(id, user);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (user.role !== 'admin' && document.uploadedBy.id !== user.id) {
      throw new ForbiddenException(
        'Access denied. You can only download your own documents.',
      );
    }
    try {
      const mimeType =
        mime.lookup(document.filename) || 'application/octet-stream';
      const response = await axios.get(document.filepath, {
        responseType: 'stream',
      });

      res.setHeader('Content-Type', mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${document.filename}"`,
      );

      (response.data as NodeJS.ReadableStream).pipe(res);
    } catch (error) {
      console.error('Error downloading file from Cloudinary:', error);
      throw new NotFoundException('Failed to download document');
    }
  }
}
