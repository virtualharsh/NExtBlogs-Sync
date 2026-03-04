import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @HttpCode(200)
  getHello(): any {
    return 'Hello World';
  }

  @Get('health')
  async healthCheck() {
    try {
      // Check database connection
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
