import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // Найдите пользователя по имени
    const user = await this.userService.findByUsername(username);
    if (user) {
      // console.log('Пользователь найден:', user); // Логирование найденного пользователя

      // Сравнение пароля пользователя с паролем из запроса
      const isPasswordMatching = await bcrypt.compare(pass, user.password);
      // console.log('Сравнение пароля:', isPasswordMatching);

      if (isPasswordMatching) {
        // Исключаем пароль из ответа
        const { password: _password, ...result } = user;
        return result;
      }
    }
    // Если пользователь не найден или пароль не совпадает
    // console.log('Неудачная попытка логина для пользователя:', username);
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }
}
