import { EnvConfig } from '@config/env.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const clientId = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const calbackUrl = configService.get<string>('GOOGLE_CALLBACK_URL');
    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: calbackUrl,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    renewAccessToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = {
      provider_id: profile.id,
      email: profile.emails[0].value,
      full_name: profile.displayName,
      avatar: profile.photos[0].value,
    };
    done(null, user);
  }
}
