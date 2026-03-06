import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CheckDto } from './dto/check.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  @ApiOperation({ summary: 'Check user and generate authentication cookie' })
  @ApiBody({ type: CheckDto })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  check(
    @Body() checkDto: CheckDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.check(checkDto, response);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  create(@Body() registerDto: RegisterDto) {
    return this.authService.create(registerDto);
  }

  @Post('/qunsafe')
  @ApiOperation({ summary: 'Query builder example (unsafe SQL)' })
  @ApiBody({ type: CheckDto })
  @ApiResponse({
    status: 200,
    description: 'Query executed using unsafe method',
  })
  findOneQueryBuilderUnsafe(@Body() checkDto: CheckDto) {
    return this.authService.findOneQueryBuilderUnsafe(checkDto);
  }

  @Post('/qsafe')
  @ApiOperation({ summary: 'Query builder example (safe SQL)' })
  @ApiBody({ type: CheckDto })
  @ApiResponse({ status: 200, description: 'Query executed using safe method' })
  findOneQueryBuilderSafe(@Body() checkDto: CheckDto) {
    return this.authService.findOneQueryBuilderSafe(checkDto);
  }
}
