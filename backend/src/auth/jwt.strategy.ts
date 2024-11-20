// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt'; // Импортируем Strategy и ExtractJwt корректно
// import { Request } from 'express';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (req: Request) => {
//           if (req && req.headers['authorization']) {
//             return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
//           } else if (req && req.cookies) {
//             return req.cookies['access_token'];
//           }
//           return null;
//         },
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET,
//     });
//   }

//   async validate(payload: any) {
//     if (!payload.sub || !payload.username || !payload.role) {
//       throw new UnauthorizedException('Invalid token payload');
//     }

//     return {
//       id: payload.sub,
//       username: payload.username,
//       role: payload.role,
//     };
//   }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt'; // Импортируем Strategy и ExtractJwt корректно
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const authHeaderToken = req?.headers['authorization']
            ? ExtractJwt.fromAuthHeaderAsBearerToken()(req)
            : null;

          const cookieToken = req?.cookies?.['access_token'] || null;

          // Лог для проверки, откуда берется токен
          console.log('Token extraction result:', {
            fromHeader: authHeaderToken,
            fromCookie: cookieToken,
          });

          return authHeaderToken || cookieToken || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Секретный ключ для подписи JWT
    });
  }

  async validate(payload: any) {
    // Лог для проверки содержимого токена
    console.log('Validating token payload:', payload);

    if (!payload.sub || !payload.username || !payload.role) {
      console.error('Invalid token payload detected:', payload);
      throw new UnauthorizedException('Invalid token payload');
    }

    // Возвращаем данные пользователя из токена
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
