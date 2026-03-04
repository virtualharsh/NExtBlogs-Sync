import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  create(LoginDto: LoginDto) {
    return 'This action adds a new auth';
  }

  findOne(body: LoginDto) {
    return `This action checks auth`;
  }
}
