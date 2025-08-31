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
      httpOnly: true, // Always true for security
      secure: this.env !== 'development', // Secure in production
      sameSite: this.env === 'development' ? 'strict' : 'lax', // Use 'lax' instead of 'none' for production
      path: '/',
      domain:
        this.env === 'development'
          ? undefined
          : this.configService.get<string>('DOMAIN'),
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
      // Method 1: Use res.cookie with empty value and maxAge: 0
      // This should match the exact same options used when setting the cookie
      res.cookie(cookie, '', {
        ...this.SET_COOKIE_OPTIONS,
        maxAge: 0,
        expires: new Date(0),
      });

      // Method 2: Try without domain (for cases where domain might cause issues)
      res.cookie(cookie, '', {
        httpOnly: true,
        secure: this.env !== 'development',
        sameSite: this.env === 'development' ? 'strict' : 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });

      // Method 3: Also try clearCookie with exact same options
      res.clearCookie(cookie, {
        ...this.SET_COOKIE_OPTIONS,
      });

      // Method 4: clearCookie without domain
      res.clearCookie(cookie, {
        httpOnly: true,
        secure: this.env !== 'development',
        sameSite: this.env === 'development' ? 'strict' : 'lax',
        path: '/',
      });
    });
  }

  deleteAuthCookies(res: Response) {
    const cookieNames = ['sid'];
    this.deleteCookies(res, ...cookieNames);
  }
}