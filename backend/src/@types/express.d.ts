import { User } from '../../user/entities/user.entity';

declare module 'express' {
  export interface Request {
    user?: User; // Добавляем поле user в Request, оно необязательное (поэтому ?)
  }
}
