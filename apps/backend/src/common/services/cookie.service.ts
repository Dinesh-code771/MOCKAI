import { ICookieOptions } from '@common/types/auth.types';
import { EnvConfig } from '@config/env.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class CookieService {
  private readonly SET_COOKIE_OPTIONS: ICookieOptions;
  private readonly JWT_TOKEN_EXPIRY: number;
  private readonly REFRESH_TOKEN_EXPIRY: number;
  private readonly env: string;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.env = this.configService.get<string>('NODE_ENV');
    this.JWT_TOKEN_EXPIRY =
      this.configService.get<number>('JWT_TOKEN_EXPIRY') * 1000;
    this.REFRESH_TOKEN_EXPIRY =
      this.configService.get<number>('REFRESH_TOKEN_EXPIRY') * 1000;

    this.SET_COOKIE_OPTIONS = {
      httpOnly: true,
      secure: this.env !== 'development',
      sameSite: this.env === 'development' ? 'strict' : 'none',
      path: '/',
      domain: this.env === 'development' ? undefined : '.mockai.com',
    };
  }

  setOnboardingCookie(res: Response) {
    res.cookie('onboarding', 'true', {
      ...this.SET_COOKIE_OPTIONS,
      maxAge: this.JWT_TOKEN_EXPIRY, // same as jwt token expiry
    });
  }

  setAuthCookie(res: Response, accessToken?: string) {    
    if (accessToken) {
      res.cookie('sid', accessToken, {
        ...this.SET_COOKIE_OPTIONS,
        maxAge: this.JWT_TOKEN_EXPIRY,
      });
    }
  }

  deleteCookies(res: Response, ...cookieNames: string[]) {
    cookieNames.forEach((cookie) => {
      res.clearCookie(cookie, {
        ...this.SET_COOKIE_OPTIONS,
        maxAge: 0,
      });
    });
  }

  deleteAuthCookies(res: Response) {
    const cookieNames = ['sid', 'refresh_token'];
    this.deleteCookies(res, ...cookieNames);
  }
}
