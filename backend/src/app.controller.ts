import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get() // Обрабатываем запрос к корневому маршруту
  getHome(): string {
    return 'Welcome to the Tax Consulting App API!';
  }
}
