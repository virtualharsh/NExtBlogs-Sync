import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CookieService {
  constructor(private readonly jwtService: JwtService) {}

  /*
  ACCESS TOKEN
  */

  setAccessTokenCookie(res: Response, payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
      expiresIn: '1d',
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000, // day * hrs * mins * seconds * millisecs
    });
  }

  validateAccessToken(req: Request) {
    const token = req.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Access token missing');
    }

    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  clearAccessTokenCookie(res: Response) {
    res.clearCookie('access_token');
  }

  /*
  REFRESH TOKEN
  */

  setRefreshTokenCookie(res: Response, payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      expiresIn: '7d',
    });

    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // day * hrs * mins * seconds * millisecs
    });
  }

  validateRefreshToken(req: Request) {
    const token = req.cookies?.refresh_token;

    if (!token) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refresh_token');
  }
}
