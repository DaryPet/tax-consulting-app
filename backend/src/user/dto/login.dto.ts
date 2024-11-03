import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;
}
