import { APP_STRINGS } from '@common/strings';
import { EnvConfig } from '@config/env.config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const jwtToken = configService.get<string>('JWT_TOKEN_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtToken,
    });
  }

  async validate(payload) {

    if (payload.type !== 'access') {
      throw new UnauthorizedException(APP_STRINGS.common.cannot_access_this_resource);
    }

    return {
      id: payload.sub,
      full_name: payload.name,
      roles: payload.roles,
      is_disabled: payload.is_disabled,
    };
  }
}
