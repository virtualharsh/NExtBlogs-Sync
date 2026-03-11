import { Global, Module } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_SECRET'),
      }),
    }),
  ],
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
