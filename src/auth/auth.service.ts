import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHi(): string {
    return 'Hi';
  }
}
