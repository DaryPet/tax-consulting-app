// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
//   Request,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { TestimonialService } from './testimonial.service';
// import { Testimonial } from './entities/testimonial.entity';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('testimonial')
// export class TestimonialController {
//   constructor(private readonly testimonialService: TestimonialService) {}

//   @UseGuards(JwtAuthGuard) // Только авторизованные пользователи могут добавлять отзывы
//   @Post()
//   async create(
//     @Body() testimonial: Partial<Testimonial>,
//     @Request() req,
//   ): Promise<Testimonial> {
//     console.log('POST /testimonial - Создание нового отзыва');
//     // Получаем username из токена авторизации и добавляем в объект отзыва
//     testimonial.username = req.user.username;
//     return await this.testimonialService.create(testimonial);
//   }

//   @Get()
//   async findAll(): Promise<Testimonial[]> {
//     return await this.testimonialService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string): Promise<Testimonial> {
//     return await this.testimonialService.findOne(+id);
//   }

//   @UseGuards(JwtAuthGuard) // Только авторизованные пользователи могут обновлять отзывы
//   @Patch(':id')
//   async update(
//     @Param('id') id: string,
//     @Body() testimonial: Partial<Testimonial>,
//     @Request() req,
//   ): Promise<Testimonial> {
//     // Проверяем, чтобы обновление производилось только своим отзывом
//     testimonial.username = req.user.username;
//     return await this.testimonialService.update(+id, testimonial);
//   }

//   @UseGuards(JwtAuthGuard) // Только авторизованные пользователи могут удалять отзывы
//   @Delete(':id')
//   async remove(@Param('id') id: string, @Request() req): Promise<void> {
//     console.log(`DELETE /testimonial/${id} - Удаление отзыва`);

//     // Проверяем, чтобы удаление производилось только своим отзывом
//     const testimonial = await this.testimonialService.findOne(+id);
//     if (testimonial.username !== req.user.username) {
//       throw new UnauthorizedException('Вы можете удалять только свои отзывы');
//     }

//     return await this.testimonialService.remove(+id);
//   }
// }
// src/testimonial/testimonial.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './entities/testimonial.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTestimonialDto } from './dto/create-testimonial.dto'; // Импортируем DTO
import { Request } from 'express';

@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  // Создание нового отзыва (только авторизованные пользователи)
  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(
    @Body() createTestimonialDto: CreateTestimonialDto,
    @Req() req: Request,
  ): Promise<Testimonial> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }
    return await this.testimonialService.create(createTestimonialDto, user);
  }

  @Get()
  async findAll(): Promise<Testimonial[]> {
    return await this.testimonialService.findAll();
  }
  // Получение всех отзывов текущего пользователя (только авторизованные пользователи)
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findAllUserTestimonials(@Req() req: Request): Promise<Testimonial[]> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }
    return await this.testimonialService.findAllUserTestimonials(user);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<Testimonial> {
  //   return await this.testimonialService.findOne(+id, user);
  // }
  // Получение конкретного отзыва по ID (только авторизованные пользователи и администраторы)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Testimonial> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }
    return await this.testimonialService.findOne(+id, user);
  }

  // Обновление отзыва (только авторизованные пользователи и администраторы)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updatedTestimonialDto: CreateTestimonialDto,
    @Req() req: Request,
  ): Promise<Testimonial> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }
    return await this.testimonialService.update(
      +id,
      updatedTestimonialDto,
      user,
    );
  }

  // Удаление отзыва (только авторизованные пользователи и администраторы)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'User information is missing or incorrect',
      );
    }
    return await this.testimonialService.remove(+id, user);
  }
}
