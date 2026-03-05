import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from './entities/login.entity';
import { Repository } from 'typeorm';
import { CheckDto } from './dto/check.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Login)
    private loginRepository: Repository<Login>,
  ) {}

  create(registerDto: RegisterDto) {
    console.log(registerDto);
    return 'This action adds a new auth';
  }

  check(body: CheckDto) {
    return `This action returns a #${body.email} auth`;
  }

  async findOneQueryBuilderSafe(body: CheckDto) {
    const user = await this.loginRepository
      .createQueryBuilder('login')
      .where('login.email = :email AND login.password = :password', {
        email: body.email,
        password: body.password,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException({
        error: 'User not found',
      });
    }
    return {
      message: 'User found',
    };
  }

  async findOneQueryBuilderUnsafe(body: CheckDto) {
    const user = await this.loginRepository
      .createQueryBuilder('login')
      .where(
        `login.email = '${body.email}' AND login.password = '${body.password}'`,
      )
      .getOne();

    if (!user) {
      throw new NotFoundException({
        error: 'User not found',
      });
    }
    return {
      message: 'User found',
    };
  }
}
