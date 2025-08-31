import { ICookieOptions } from '@common/types/auth.types';
import { EnvConfig } from '@config/env.config';
import { Injectable, Logger } from '@nestjs/common';
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
      sameSite: this.env === 'development' ? 'strict' : 'none', // Use 'lax' instead of 'none' for production
      path: '/',
      domain:
        this.env === 'development'
          ? undefined
          : undefined,
    };
  }

  setOnboardingCookie(res: Response) {
    res.cookie('onboarding', 'true', {
      ...this.SET_COOKIE_OPTIONS,
      maxAge: this.JWT_TOKEN_EXPIRY, // same as jwt token expiry
    });
  }

  setAuthCookie(res: Response, accessToken?: string, maxAge?: number) {
    if (accessToken) {
      Logger.log(`Setting cookie: sid`);
      res.cookie('sid', accessToken, {
        ...this.SET_COOKIE_OPTIONS,
        maxAge: maxAge ? maxAge : this.JWT_TOKEN_EXPIRY,
      });
    }
  }

  deleteCookies(res: Response, ...cookieNames: string[]) {
    cookieNames.forEach((cookie) => {
      // Method 1: Use res.cookie with empty value and maxAge: 0
      // This should match the exact same options used when setting the cookie
      // res.cookie(cookie, '', {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'lax',
      //   path: '/',
      //   domain: '.up.railway.app',
      //   maxAge: 0,
      //   expires: new Date(0),
      // });

      // Logger.log(`Deleted cookie: ${cookie}`);
      // Logger.log(`Cookie options: ${JSON.stringify(this.SET_COOKIE_OPTIONS)}`);

      // Method 3: Also try clearCookie with exact same options
      Logger.log(`Clearing cookie: ${cookie}`);
      this.setAuthCookie(res, '', 0);
      // res.clearCookie(cookie, {
      //   ...this.SET_COOKIE_OPTIONS,
      // });

      // Method 4: clearCookie without domain
      // Logger.log(`Clearing cookie: ${cookie}`);
      // res.clearCookie(cookie, {
      //   httpOnly: true,
      //   secure: this.env !== 'development',
      //   sameSite: this.env === 'development' ? 'strict' : 'lax',
      //   path: '/',
      // });
    });
  }

  deleteAuthCookies(res: Response) {
    const cookieNames = ['sid'];
    this.deleteCookies(res, ...cookieNames);
  }
}