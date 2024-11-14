import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Настройка CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Оставьте для локальной разработки
      'https://tax-consulting-app-git-main-darya-petrenkos-projects.vercel.app', // Укажите домен вашего фронтенда на Vercel
    ],
    credentials: true,
  });
  app.use(cookieParser()); // Используем cookie-parser для обработки куки
  // app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
