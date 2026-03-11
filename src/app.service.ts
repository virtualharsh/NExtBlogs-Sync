import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getHello() {
    return 'Hello World!';
  }

  async healthCheck() {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'success',
        message: 'Application is healthy',
        database: 'connected',
      };
    } catch (error) {
      console.log(error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        status: 'error',
        message: 'Database connection failed',
        database: 'disconnected',
      });
    }
  }
}
