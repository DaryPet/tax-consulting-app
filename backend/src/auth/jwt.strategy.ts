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
          console.log('Authorization Header:', req.headers['authorization']);
          console.log('Cookies:', req.cookies);
          const authHeaderToken = req?.headers['authorization']
            ? ExtractJwt.fromAuthHeaderAsBearerToken()(req)
            : null;

          const cookieToken = req?.cookies?.['refresh_token'] || null;
          console.log('Token extraction result:', {
            fromHeader: authHeaderToken,
            fromCookie: cookieToken,
          });

          return authHeaderToken || cookieToken || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('Validating token payload:', payload);

    if (!payload.sub || !payload.username || !payload.role) {
      console.error('Invalid token payload detected:', payload);
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
