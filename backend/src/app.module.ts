import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { BookingModule } from './booking/booking.module';
import { DocumentModule } from './documents/document.module';
import { CloudinaryConfigService } from './config/cloudinary.config';

console.log('Загрузка AppModule');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       url: process.env.DATABASE_URL, // Используем строку подключения из переменных окружения
//       // host: 'localhost',
//       // port: 5432,
//       // username: 'tax_user',
//       // password: '12345',
//       // database: 'tax_consulting',
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       autoLoadEntities: true,
//       synchronize: true,
//     }),
//     BookingModule,
//     UserModule,
//     AuthModule,
//     TestimonialModule,
//     DocumentModule,
//   ],
// })
// export class AppModule {}
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делаем ConfigModule глобальным, чтобы использовать его во всех модулях
      envFilePath: '.env', // Путь к вашему файлу .env
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // 2. Изменено: используем configService вместо config
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // 3. Изменено: используем configService для получения URL базы данных
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService], // 4. Изменено: заменили ConfigModule на ConfigService для правильного внедрения зависимости
    }),
    BookingModule,
    UserModule,
    AuthModule,
    TestimonialModule,
    DocumentModule,
  ],
  providers: [CloudinaryConfigService],
})
export class AppModule {}
