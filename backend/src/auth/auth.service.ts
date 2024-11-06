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
    // Шаг 1: Найти пользователя по имени пользователя
    const user = await this.userService.findByUsername(username);
    if (!user) {
      console.log('Пользователь не найден');
      return null;
    }

    // Лог найденного пользователя
    console.log('Найден пользователь:', user);

    // Сравнение введенного пароля с хэшированным паролем из базы данных

    // Лог введенного пароля и хэшированного пароля для проверки
    console.log('Введенный пароль:', pass);
    console.log('Хэшированный пароль в базе данных:', user.password);

    // Проверка совпадения паролей
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    console.log('Результат сравнения паролей:', isPasswordMatching);

    if (!isPasswordMatching) {
      console.log('Пароль не совпадает');
      return null;
    }
    console.log('Успешная проверка пользователя');

    // Возврат пользователя без пароля
    const { password: _password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
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
    try {
      // Генерация соли и хэширование пароля
      const salt = await bcrypt.genSalt(10);
      console.log('Сгенерированная соль:', salt);

      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      console.log('Хэшированный пароль:', hashedPassword);

      // Установка роли по умолчанию, если она не указана
      const role = createUserDto.role ? createUserDto.role : 'user';

      // Создание пользователя с захэшированным паролем и ролью
      const user = await this.userService.create({
        ...createUserDto,
        password: hashedPassword,
        role: role, // Устанавливаем роль ('user' по умолчанию или указанную)
      });

      console.log('Созданный пользователь:', user);
      return user;
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      // throw new Error('Ошибка при регистрации');
      throw error;
    }
  }

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

    const payload = { username: user.username, sub: user.id, role: user.role };
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
