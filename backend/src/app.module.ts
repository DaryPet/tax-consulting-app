import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { BookingModule } from './booking/booking.module';
import { DocumentModule } from './documents/document.module';
import { CloudinaryConfigService } from './config/cloudinary.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
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
