import {
  IsString,
  IsOptional,
  IsIn,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsOptional() // Поле является необязательным при регистрации
  @IsIn(['user', 'admin']) // Значение может быть только 'user' или 'admin'
  readonly role?: string; // Опционально: если не указано, по умолчанию будет 'user'
}
