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
  @IsOptional()
  @IsIn(['user', 'admin'])
  readonly role?: string;
}
