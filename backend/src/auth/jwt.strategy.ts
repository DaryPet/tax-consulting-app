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
          return ExtractJwt.fromAuthHeaderAsBearerToken()(req); // Извлечение токена из заголовка Authorization (как было раньше)
        } else if (req && req.cookies) {
          return req.cookies['accessToken']; // Извлечение токена из куки, если нет заголовка
        }
        return null; // Возвращаем null, если токен не найден
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
