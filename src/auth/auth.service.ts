import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from './entities/auth.entity';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Login)
    private loginRepository: Repository<Login>,
  ) {}
  async create(body: LoginDto) {
    // const hashedPassword: string = await bcrypt.hash(body.password, 10);
    const user = this.loginRepository.create({
      email: body.email,
      username: 'RandomPerson',
      password: body.password,
    });

    return await this.loginRepository.save(user);
  }

  async findOneQueryBuilderSafe(body: LoginDto) {
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

  async findOneQueryBuilderUnsafe(body: LoginDto) {
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

  async findOne(body: LoginDto) {
    const user = await this.loginRepository.findOne({
      where: { email: body.email, password: body.password },
      select: ['id', 'email'],
    });

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
