import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
  ) {}

  create(testimonial: Partial<Testimonial>, user: any): Promise<Testimonial> {
    const newTestimonial = this.testimonialRepository.create({
      ...testimonial,
      user,
    });
    return this.testimonialRepository.save(newTestimonial);
  }

  findAll(): Promise<Testimonial[]> {
    return this.testimonialRepository.find();
  }
  // Получение всех отзывов текущего пользователя
  async findAllUserTestimonials(user: any): Promise<Testimonial[]> {
    return await this.testimonialRepository.find({
      where: { user: { id: user.id } },
    });
  }

  // Получение конкретного отзыва по ID
  async findOne(id: number, user: any): Promise<Testimonial> {
    const testimonial = await this.testimonialRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }
    // Проверка прав доступа
    if (user.role !== 'admin' && testimonial.user.id !== user.id) {
      throw new ForbiddenException('You can only view your own testimonials.');
    }

    return testimonial;
  }

  // Обновление отзыва
  async update(
    id: number,
    updatedTestimonial: Partial<Testimonial>,
    user: any,
  ): Promise<Testimonial> {
    const testimonial = await this.findOne(id, user);
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }
    if (user.role !== 'admin' && testimonial.user.id !== user.id) {
      throw new ForbiddenException(
        'You can only update your own testimonials.',
      );
    }
    Object.assign(testimonial, updatedTestimonial);
    return await this.testimonialRepository.save(testimonial);
  }

  // Удаление отзыва
  async remove(id: number, user: any): Promise<void> {
    const testimonial = await this.findOne(id, user);
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }
    if (user.role !== 'admin' && testimonial.user.id !== user.id) {
      throw new ForbiddenException(
        'You can only delete your own testimonials.',
      );
    }
    await this.testimonialRepository.delete(id);
  }
}
