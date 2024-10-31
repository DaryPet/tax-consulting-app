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
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './entities/testimonial.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTestimonialDto } from './dto/create-testimonial.dto'; // Импортируем DTO

@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @UseGuards(JwtAuthGuard) // Только авторизованные пользователи могут добавлять отзывы
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Включаем валидацию
  async create(
    @Body() createTestimonialDto: CreateTestimonialDto,
  ): Promise<Testimonial> {
    return await this.testimonialService.create(createTestimonialDto);
  }

  @Get()
  async findAll(): Promise<Testimonial[]> {
    return await this.testimonialService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Testimonial> {
    return await this.testimonialService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard) // Только авторизованные пользователи могут обновлять отзывы
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Включаем валидацию для обновления
  async update(
    @Param('id') id: string,
    @Body() createTestimonialDto: CreateTestimonialDto,
  ): Promise<Testimonial> {
    return await this.testimonialService.update(+id, createTestimonialDto);
  }

  @UseGuards(JwtAuthGuard) // Только авторизованные пользователи могут удалять отзывы
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.testimonialService.remove(+id);
  }
}
