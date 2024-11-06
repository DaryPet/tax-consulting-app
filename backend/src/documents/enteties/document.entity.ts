// backend/src/documents/entities/document.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity'; // Импортируем сущность User

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

  // @Column()
  // uploadedBy: string; // имя пользователя или ID пользователя, который загрузил документ
  @ManyToOne(() => User, (user) => user.documents, {
    eager: true,
    onDelete: 'CASCADE',
  })
  uploadedBy: User; // Связь с пользователем, который загрузил документ
}
export default Document;
