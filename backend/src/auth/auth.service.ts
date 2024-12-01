import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../auth/enteties/session.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  private createSession(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
      refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 день
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      console.log('Пользователь не найден');
      return null;
    }
    console.log('Найден пользователь:', user);

    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    console.log('Результат сравнения паролей:', username, isPasswordMatching);

    if (!isPasswordMatching) {
      console.log('Пароль не совпадает');
      return null;
    }
    console.log('Успешная проверка пользователя');

    const { password: _password, ...result } = user;
    console.log('Данные пользователя без пароля:', result);
    return result;
  }

  async login(user: any) {
    const newSession = this.createSession(user);
    const session = this.sessionRepository.create({
      userId: user.id,
      ...newSession,
    });

    await this.sessionRepository.save(session);
    console.log('Сохраненная сессия:', session);
    return {
      access_token: newSession.accessToken,
      refresh_token: newSession.refreshToken,
      session_id: session.id,
    };
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const role = createUserDto.role ? createUserDto.role : 'user';
      const user = await this.userService.create({
        ...createUserDto,
        password: hashedPassword,
        role: role,
      });

      console.log('Созданный пользователь:', user);
      return user;
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      throw error;
    }
  }

  async refreshUserSession(sessionId: number, refreshToken: string) {
    console.log(`SessionId: ${sessionId}, RefreshToken: ${refreshToken}`);
    console.log(
      `Пытаемся найти сессию с id: ${sessionId} и refreshToken: ${refreshToken}`,
    );
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, refreshToken },
    });
    console.log('Found session:', session);
    if (!session) {
      console.error('Сессия не найдена или неверный refreshToken');
      throw new Error('Session not found');
    }

    const isSessionTokenExpired = new Date() > session.refreshTokenValidUntil;

    if (isSessionTokenExpired) {
      console.error('Refresh token истек');
      throw new Error('Session token expired');
    }

    const newSession = this.createSession({ id: session.userId });
    console.log('Создана новая сессия:', newSession);
    session.accessToken = newSession.accessToken;
    session.refreshToken = newSession.refreshToken;
    session.accessTokenValidUntil = newSession.accessTokenValidUntil;
    session.refreshTokenValidUntil = newSession.refreshTokenValidUntil;

    await this.sessionRepository.save(session);
    console.log('Обновленная сессия:', session);

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      id: session.id,
    };
  }

  async logout(sessionId: number, refreshToken: string) {
    console.log(
      `Пытаемся найти и удалить сессию с id: ${sessionId} и refreshToken: ${refreshToken}`,
    );

    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, refreshToken },
    });

    if (!session) {
      console.error('Сессия не найдена по id:', sessionId);
      throw new Error('Session not found or already deleted');
    }

    await this.sessionRepository.delete({ id: sessionId });
    console.log('Сессия успешно удалена');
  }

  async getCurrentUser(userId: number) {
    const currentUser = await this.userService.findById(userId);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const { password: _password, ...result } = currentUser;
    return result;
  }
  // Новый метод для поиска сессии по ID
  async getSessionById(sessionId: number): Promise<Session> {
    console.log(`Ищем сессию по id: ${sessionId}`);
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      console.error('Сессия не найдена с id:', sessionId);
      throw new Error('Session not found');
    }

    console.log('Найдена сессия:', session);
    return session;
  }
}
