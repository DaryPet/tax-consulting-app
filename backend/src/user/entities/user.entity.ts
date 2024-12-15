import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Session } from '../../auth/enteties/session.entity';
import { Document } from '../../documents/enteties/document.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Testimonial } from 'src/testimonial/entities/testimonial.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Document, (document) => document.uploadedBy)
  documents: Document[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Testimonial, (testimonial) => testimonial.user)
  testimonials: Testimonial[];
}
