import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  findOne(@Body() loginDto: LoginDto) {
    return this.authService.findOne(loginDto);
  }

  @Post('/register')
  create(@Body() loginDto: LoginDto) {
    return this.authService.create(loginDto);
  }

  @Post('/qunsafe')
  findOneQueryBuilderUnsafe(@Body() loginDto: LoginDto) {
    return this.authService.findOneQueryBuilderUnsafe(loginDto);
  }

  @Post('/qsafe')
  findOneQueryBuilderSafe(@Body() loginDto: LoginDto) {
    return this.authService.findOneQueryBuilderSafe(loginDto);
  }
}
