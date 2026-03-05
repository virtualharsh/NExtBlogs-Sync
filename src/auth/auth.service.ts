import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from './entities/login.entity';
import { Repository } from 'typeorm';
import { CheckDto } from './dto/check.dto';
import { hash, compare } from 'bcrypt';
import { Response } from 'express';
import { CookieService } from 'src/common/cookie/cookie.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Login)
    private loginRepository: Repository<Login>,
    private readonly cookieService: CookieService,
  ) {}

  async create(body: RegisterDto) {
    try {
      const hashedPassword = await hash(body.password, 12);
      const user = this.loginRepository.create({
        email: body.email,
        password: hashedPassword,
      });
      const res = await this.loginRepository.save(user);
      if (res) {
        return {
          message: 'User created successfully',
        };
      }
    } catch (error) {
      console.log(typeof error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  async check(body: CheckDto, response: Response) {
    try {
      const user = await this.loginRepository
        .createQueryBuilder('login')
        .select(['login.user_id', 'login.password'])
        .where('login.email=:email', { email: body.email })
        .orWhere('login.username=:username', { username: body.username })
        .getOne();

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      if (!user || !user.password || !body.password) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const isPasswordValid = await compare(body.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // TODO: Set cookie
      console.log(user.user_id);

      this.cookieService.setAccessTokenCookie(response, {
        user_id: user.user_id,
      });
      this.cookieService.setRefreshTokenCookie(response, {
        user_id: user.user_id,
      });
      return {
        message: 'Login successful',
      };
    } catch (error) {
      throw error;
    }
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
