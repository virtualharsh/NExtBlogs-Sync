import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LogoutController } from './logout/logout.controller';
import { LogoutService } from './logout/logout.service';

@Module({
  controllers: [AuthController, LogoutController],
  providers: [AuthService, LogoutService],
})
export class AuthModule {}
