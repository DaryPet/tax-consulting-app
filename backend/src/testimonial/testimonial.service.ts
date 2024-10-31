import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
  ) {}

  create(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const newTestimonial = this.testimonialRepository.create(testimonial);
    return this.testimonialRepository.save(newTestimonial);
  }

  findAll(): Promise<Testimonial[]> {
    return this.testimonialRepository.find();
  }

  findOne(id: number): Promise<Testimonial> {
    return this.testimonialRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updatedTestimonial: Partial<Testimonial>,
  ): Promise<Testimonial> {
    await this.testimonialRepository.update(id, updatedTestimonial);
    return this.testimonialRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.testimonialRepository.delete(id);
  }
}
