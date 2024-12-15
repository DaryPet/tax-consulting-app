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
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    if (!isPasswordMatching) {
      return null;
    }

    const { password: _password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const newSession = this.createSession(user);
    const session = this.sessionRepository.create({
      userId: user.id,
      ...newSession,
    });

    await this.sessionRepository.save(session);
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
      const {
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
      } = this.createSession(user);

      if (!user.id) {
        console.error('Ошибка: user.id не существует!');
        throw new Error('User ID is missing');
      }
      const session = this.sessionRepository.create({
        userId: user.id,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
      });
      await this.sessionRepository.save(session);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        session_id: session.id,
        user: { ...user, role },
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshUserSession(sessionId: number, refreshToken: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, refreshToken },
    });
    if (!session) {
      throw new Error('Session not found');
    }

    const isSessionTokenExpired = new Date() > session.refreshTokenValidUntil;

    if (isSessionTokenExpired) {
      throw new Error('Session token expired');
    }
    const user = await this.userService.findById(session.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newSession = this.createSession(user);
    session.accessToken = newSession.accessToken;
    session.refreshToken = newSession.refreshToken;
    session.accessTokenValidUntil = newSession.accessTokenValidUntil;
    session.refreshTokenValidUntil = newSession.refreshTokenValidUntil;

    await this.sessionRepository.save(session);

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      id: session.id,
    };
  }

  async logout(sessionId: number, refreshToken: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { id: sessionId },
      });
      if (!session) {
        throw new Error('Session not found or already deleted');
      }

      if (session.refreshToken.trim() !== refreshToken.trim()) {
        throw new Error('Invalid refresh token');
      }
      await this.sessionRepository.delete({ id: sessionId });
    } catch (error) {
      throw new Error('Error while delete the sesssion');
    }
  }

  async getCurrentUser(userId: number) {
    const currentUser = await this.userService.findById(userId);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const { password: _password, ...result } = currentUser;
    return result;
  }
  async getSessionById(sessionId: number): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }
}
