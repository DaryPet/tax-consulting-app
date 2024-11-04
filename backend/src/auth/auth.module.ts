// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { UserModule } from '../user/user.module';
// import { AuthService } from './auth.service';
// import { JwtStrategy } from './jwt.strategy';
// import { AuthController } from './auth.controller';
// import { LogoutService } from './logout.service';
// import { LogoutController } from './logout.controller';

// // import { TypeOrmModule } from '@nestjs/typeorm';
// // import { Session } from './entities/session.entity';
// // import { SessionService } from './session.service';

// // console.log('JWT_SECRET:', process.env.JWT_SECRET);

// @Module({
//   imports: [
//     UserModule,
//     PassportModule,
//     JwtModule.register({
//       secret: process.env.JWT_SECRET,
//       signOptions: { expiresIn: '1h' },
//     }),
//   ],
//   controllers: [AuthController, LogoutController], // Добавьте контроллер здесь
//   providers: [AuthService, JwtStrategy, LogoutService],
//   exports: [AuthService],
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { SessionModule } from '../auth/session.module.js';
import { Session } from '../auth/enteties/session.entity.js';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    SessionModule, // Импорт SessionModule
    TypeOrmModule.forFeature([Session]), // Добавляем Session в TypeOrmModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
