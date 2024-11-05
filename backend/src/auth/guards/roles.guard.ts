// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     // Получаем роль, которая требуется для доступа к методу
//     const requiredRole = this.reflector.get<string>(
//       'role',
//       context.getHandler(),
//     );
//     if (!requiredRole) {
//       return true; // Если роль не указана, доступ разрешен всем
//     }

//     // Получаем пользователя из запроса
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     // Проверяем, совпадает ли роль пользователя с требуемой ролью
//     return user.role === requiredRole;
//   }
// }
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Получаем требуемую роль из метаданных маршрута
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );

    // Если роль не указана, значит маршрут открыт для всех авторизованных пользователей
    if (!requiredRole) {
      return true;
    }

    // Получаем пользователя из запроса
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Логирование для отладки
    console.log('Required Role:', requiredRole);
    console.log('User:', user);
    console.log(user.role);

    // Проверяем, существует ли пользователь в запросе
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    // Проверяем, совпадает ли роль пользователя с требуемой ролью
    if (user.role !== requiredRole) {
      throw new ForbiddenException(
        'Access denied. You do not have the required role.',
      );
    }

    return true; // Доступ разрешен, если пользователь имеет необходимую роль
  }
}
