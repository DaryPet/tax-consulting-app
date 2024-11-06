import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Если токена нет, разрешаем доступ, иначе запускаем стандартный Guard
    if (!authHeader) {
      return true;
    }
    return super.canActivate(context);
  }
}
