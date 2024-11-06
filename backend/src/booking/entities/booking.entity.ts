import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  service?: string;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column({ unique: true })
  uniqueToken: string; // Уникальный токен для управления бронированием

  @ManyToOne(() => User, (user) => user.bookings, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;
}
