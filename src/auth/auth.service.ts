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
import { Response, Request } from 'express';
import { CookieService } from 'src/common/cookie/cookie.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Login)
    private loginRepository: Repository<Login>,
    private readonly cookieService: CookieService,
  ) {}

  private async checkAccountDisabled(body: RegisterDto) {
    const user = await this.loginRepository
      .createQueryBuilder('login')
      .where('login.email = :email', {
        email: body.email,
      })
      .getOne();

    if (user) {
      this.loginRepository.update(user.user_id, { status: true });
      return true;
    }
    return false;
  }

  async create(body: RegisterDto) {
    try {
      const hashedPassword = await hash(body.password, 12);

      const accountDisabled = await this.checkAccountDisabled(body);
      if (accountDisabled) {
        return {
          message: 'User created successfully',
          created: true,
          statusCode: 201,
        };
      }
      const user = this.loginRepository.create({
        email: body.email,
        password: hashedPassword,
      });
      const res = await this.loginRepository.save(user);
      if (res) {
        return {
          message: 'User created successfully',
          created: true,
          statusCode: 201,
        };
      }
    } catch (error) {
      console.log(error);
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
        .select([
          'login.user_id',
          'login.password',
          'login.username',
          'login.status',
        ])
        .where('(login.email=:email OR login.username=:username)', {
          email: body.email,
          username: body.username,
        })
        .andWhere('login.status=1')
        .getOne();

      if (user?.status == false) {
        throw new UnauthorizedException('User account disabled'); // TODO: send message along with the error
      }
      if (!user) {
        throw new UnauthorizedException('User Not Found'); // TODO: send message along with the error
      }
      if (!user || !user.password || !body.password) {
        throw new UnauthorizedException('Invalid credentials 2');
      }
      const isPasswordValid = await compare(body.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials 3');
      }

      this.cookieService.setAccessAndRefreshToken(response, {
        user_id: user.user_id,
      });
      return {
        message: 'Login successful',
        username: user.username === '' ? 'LifeSailor' : user.username,
      };
    } catch (error) {
      throw error;
    }
  }

  async disableAccount(
    req: Request,
    res: Response,
    permanentDeleteFlag: boolean = false,
  ) {
    const accessTokenID = this.cookieService.validateAccessToken(req)?.user_id;
    const refreshTokenID =
      this.cookieService.validateRefreshToken(req)?.user_id;

    if (accessTokenID !== refreshTokenID) {
      throw new UnauthorizedException({
        message: 'User not authenticated',
        loginRedirect: true,
      });
    }
    this.cookieService.clearAccessAndRefreshToken(res);
    this.loginRepository.update(accessTokenID, { status: false });
    return {
      message: permanentDeleteFlag ? 'User Deleted' : 'User Deactivated',
      status: 200,
    };
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
      message: 'Login successful',
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
