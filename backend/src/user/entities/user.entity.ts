import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Session } from '../../auth/enteties/session.entity';
import { Document } from '../../documents/enteties/document.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Testimonial } from 'src/testimonial/entities/testimonial.entity';

@Entity('users') // Декоратор, обозначающий, что этот класс представляет сущность базы данных
export class User {
  @PrimaryGeneratedColumn() // Автоматически генерируемый уникальный идентификатор пользователя
  id: number;

  @Column() // Имя пользователя
  name: string;

  @Column({ unique: true }) // Email пользователя, должен быть уникальным
  email: string;

  @Column() // Пароль пользователя
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: 'user' }) // Роль по умолчанию - обычный пользователь
  role: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Document, (document) => document.uploadedBy) // Связь с документами, которые загрузил пользователь
  documents: Document[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[]; // Связь "один ко многим" с бронированиями

  @OneToMany(() => Testimonial, (testimonial) => testimonial.user)
  testimonials: Testimonial[]; // Связь "Один ко Многим" с отзывами
}
