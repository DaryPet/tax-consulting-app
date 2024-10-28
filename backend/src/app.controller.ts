// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }


import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get() // Обрабатываем запрос к корневому маршруту
  getHome(): string {
    return 'Welcome to the Tax Consulting App API!';
  }
}
