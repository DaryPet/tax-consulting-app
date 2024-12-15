import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  filepath: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.documents, {
    eager: true,
    onDelete: 'CASCADE',
  })
  uploadedBy: User;
}
export default Document;
