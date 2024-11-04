import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Session } from '../../auth/enteties/session.entity';

@Entity() // Декоратор, обозначающий, что этот класс представляет сущность базы данных
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

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
