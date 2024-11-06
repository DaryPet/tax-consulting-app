// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     // Получаем требуемую роль из метаданных маршрута
//     const requiredRole = this.reflector.get<string[]>(
//       'role',
//       context.getHandler(),
//     );

//     // Если роль не указана, значит маршрут открыт для всех авторизованных пользователей
//     if (!requiredRole) {
//       return true;
//     }

//     // Получаем пользователя из запроса
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     // Логирование для отладки
//     console.log('Required Role:', requiredRole);
//     console.log('User:', user);
//     console.log(user.role);

//     // Проверяем, существует ли пользователь в запросе
//     if (!user) {
//       throw new UnauthorizedException('User is not authenticated');
//     }

//     // Проверяем, совпадает ли роль пользователя с требуемой ролью
//     if (user.role !== requiredRole) {
//       throw new ForbiddenException(
//         'Access denied. You do not have the required role.',
//       );
//     }
//     return true; // Доступ разрешен, если пользователь имеет необходимую роль
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
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('Required Roles:', requiredRoles);
    console.log('User:', user);

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Access denied. You do not have the required role.',
      );
    }

    return true;
  }
}
