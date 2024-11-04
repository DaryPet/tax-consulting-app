import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column()
  refreshToken: string;

  @Column()
  accessToken: string;

  @Column()
  accessTokenValidUntil: Date;

  @Column()
  refreshTokenValidUntil: Date;
}
