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
