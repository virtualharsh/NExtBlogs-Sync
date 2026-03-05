import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CheckDto } from './dto/check.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  check(@Body() checkDto: CheckDto) {
    return this.authService.check(checkDto);
  }

  @Post('register')
  create(@Body() registerDto: RegisterDto) {
    return this.authService.create(registerDto);
  }

  @Post('/qunsafe')
  findOneQueryBuilderUnsafe(@Body() checkDto: CheckDto) {
    return this.authService.findOneQueryBuilderUnsafe(checkDto);
  }

  @Post('/qsafe')
  findOneQueryBuilderSafe(@Body() checkDto: CheckDto) {
    return this.authService.findOneQueryBuilderSafe(checkDto);
  }
}
