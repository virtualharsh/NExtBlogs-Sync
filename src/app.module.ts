import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CookieModule } from './common/cookie/cookie.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    AuthModule,
    CookieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
