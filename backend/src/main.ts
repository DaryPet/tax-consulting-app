import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// dotenv.config(); // Загружаем переменные окружения из .env файла

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Используем cookie-parser для обработки куки
  await app.listen(3000);
}
bootstrap();
