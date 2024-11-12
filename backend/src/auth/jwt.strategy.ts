import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { ExtractJwt } from 'passport-jwt'; // Исправлено: ExtractJwt теперь используется

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        // Извлекаем JWT токен либо из заголовка Authorization, либо из куки 'accessToken'
        if (req && req.headers['authorization']) {
          const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
          console.log('Токен из заголовка:', token);
          return token; // Извлечение токена из заголовка Authorization (как было раньше)
        } else if (req && req.cookies) {
          return req.cookies['refresh_token']; // Извлечение токена из куки, если нет заголовка
        }
        console.log('Токен не найден');
        return null; // Возвращаем null, если токен не найден
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    console.log('Значение JWT_SECRET:', process.env.JWT_SECRET);
  }

  async validate(payload: any) {
    return {
      id: payload.sub, // Используем `id` вместо `userId` для единообразия
      username: payload.username,
      role: payload.role,
    };
  }
}
