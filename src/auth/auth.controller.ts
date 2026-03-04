import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  findOne(loginDto: LoginDto) {
    return this.authService.findOne(loginDto);
  }

  @Post('/register')
  create(@Body() loginDto: LoginDto) {
    return this.authService.create(loginDto);
  }
}
