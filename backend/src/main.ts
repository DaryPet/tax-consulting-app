import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://tax-consulting-app-git-main-darya-petrenkos-projects.vercel.app', // Укажите домен вашего фронтенда на Vercel
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
