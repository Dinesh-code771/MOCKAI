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
      res.cookie('sid', res.cookie['sid'], {
        ...this.SET_COOKIE_OPTIONS,
        maxAge: 1,
      });
      
      // Try multiple clearing strategies
      const baseOptions: ICookieOptions = {
        httpOnly: true,
        secure: this.env !== 'development',
        sameSite: this.env === 'development' ? 'strict' : 'lax',
        path: '/',
      };
  
      // Clear with original domain
      res.clearCookie(cookie, {
        ...baseOptions,
        domain: this.SET_COOKIE_OPTIONS.domain,
      });
  
      // Clear without domain
      res.clearCookie(cookie, baseOptions);
  
      // For Railway, also try with explicit Railway domain
      if (this.env !== 'development') {
        res.clearCookie(cookie, {
          ...baseOptions,
          domain: '.up.railway.app',
        });
      }
    });
  }

  deleteAuthCookies(res: Response) {
    const cookieNames = ['sid', 'refresh_token'];
    this.deleteCookies(res, ...cookieNames);
  }
}
