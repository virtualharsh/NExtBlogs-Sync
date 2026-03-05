import { Exclude } from 'class-transformer';
import { IsAscii, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  @IsAscii()
  password!: string;
}
