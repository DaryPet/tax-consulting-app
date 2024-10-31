import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller'; // Необходимо добавить импорт AuthController

// console.log('JWT_SECRET:', process.env.JWT_SECRET);

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController], // Добавьте контроллер здесь
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
