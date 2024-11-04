// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../user/user.service';
// import { CreateUserDto } from '../user/dto/create-user.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Session } from './enteties/session.entity';
// import { User } from '../user/entities/user.entity';
// import * as bcrypt from 'bcryptjs';

// @Injectable()
// export class AuthService {
//   constructor(
//     private userService: UserService,
//     private jwtService: JwtService,
//     @InjectRepository(Session)
//     private sessionRepository: Repository<Session>,
//   ) {}

//   async validateUser(username: string, pass: string): Promise<any> {
//     // Найдите пользователя по имени
//     const user = await this.userService.findByUsername(username);
//     if (user) {
//       // console.log('Пользователь найден:', user); // Логирование найденного пользователя

//       // Сравнение пароля пользователя с паролем из запроса
//       const isPasswordMatching = await bcrypt.compare(pass, user.password);
//       // console.log('Сравнение пароля:', isPasswordMatching);

//       if (isPasswordMatching) {
//         // Исключаем пароль из ответа
//         const { password: _password, ...result } = user;
//         return result;
//       }
//     }
//     // Если пользователь не найден или пароль не совпадает
//     // console.log('Неудачная попытка логина для пользователя:', username);
//     return null;
//   }

//   async login(user: User) {
//     const payload = { username: user.username, sub: user.id };
//     const accessToken = this.jwtService.sign(payload, { expiresIn: '30m' });
//     // Генерация refresh токена
//     const refreshToken = await bcrypt.hash(
//       `${user.username}-${Date.now()}`,
//       10,
//     );

//     // Срок действия токенов
//     const accessTokenValidUntil = new Date();
//     accessTokenValidUntil.setMinutes(accessTokenValidUntil.getMinutes() + 15);
//     const refreshTokenValidUntil = new Date();
//     refreshTokenValidUntil.setDate(refreshTokenValidUntil.getDate() + 1);

//     // Создание новой сессии
//     const session = this.sessionRepository.create({
//       user,
//       refreshToken,
//       accessTokenValidUntil,
//       refreshTokenValidUntil,
//     });
//     await this.sessionRepository.save(session);
//     return {
//       accessToken,
//       refreshToken,
//     };
//   }
//   async register(createUserDto: CreateUserDto) {
//     const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
//     const user = await this.userService.create({
//       ...createUserDto,
//       password: hashedPassword,
//     });
//     return user;
//   }
//   async refresh(refreshToken: string) {
//     const session = await this.sessionRepository.findOne({
//       where: { refreshToken },
//     });

//     if (!session) {
//       throw new UnauthorizedException('Invalid refresh token');
//     }

//     if (session.refreshTokenValidUntil < new Date()) {
//       throw new UnauthorizedException('Refresh token expired');
//     }

//     const payload = { username: session.user.username, sub: session.user.id };
//     const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

//     // Обновление времени действия токена доступа
//     session.accessTokenValidUntil = new Date();
//     session.accessTokenValidUntil.setMinutes(
//       session.accessTokenValidUntil.getMinutes() + 15,
//     );

//     await this.sessionRepository.save(session);
//     return {
//       accessToken,
//     };
//   }
//   async logout(refreshToken: string): Promise<void> {
//     const session = await this.sessionRepository.findOne({
//       where: { refreshToken },
//     });

//     if (!session) {
//       throw new UnauthorizedException('Invalid refresh token');
//     }

//     await this.sessionRepository.remove(session);
//   }
// }
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../auth/enteties/session.entity.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>, // Инъекция SessionRepository
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user) {
      const isPasswordMatching = await bcrypt.compare(pass, user.password);
      if (isPasswordMatching) {
        const { password: _password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Пример срока действия для refresh token
    });

    // Сохранение сессии в базе данных
    const newSession = this.sessionRepository.create({
      userId: user.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 60 * 60 * 1000), // 1 час
      refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    });
    await this.sessionRepository.save(newSession);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }

  // async logout(userId: number) {
  //   // Удаление всех сессий для пользователя
  //   await this.sessionRepository.delete({ userId });
  //   return { message: 'Logout successful' };
  // }
  async logout(refreshToken: string) {
    // Удаление сессии из базы данных, используя refreshToken
    const session = await this.sessionRepository.findOneBy({ refreshToken });

    if (!session) {
      throw new Error('Session not found');
    }

    await this.sessionRepository.delete({ refreshToken });

    return { message: 'Logout successful' };
  }

  async refreshToken(oldRefreshToken: string) {
    // Проверка валидности refresh token и обновление сессии
    const session = await this.sessionRepository.findOneBy({
      refreshToken: oldRefreshToken,
    });

    if (!session) {
      throw new Error('Invalid refresh token');
    }

    // Извлечение пользователя из базы данных по userId, хранящемуся в сессии
    const user = await this.userService.findById(session.userId);
    if (!user) {
      throw new Error('User not found for the given session');
    }

    const payload = { username: user.username, sub: user.id };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    session.accessToken = newAccessToken;
    session.refreshToken = newRefreshToken;
    session.accessTokenValidUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 час
    session.refreshTokenValidUntil = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ); // 7 дней
    await this.sessionRepository.save(session);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
}
