import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Testimonial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  title: string;

  @Column()
  content: string;

  // @Column()
  // date: Date;
}
