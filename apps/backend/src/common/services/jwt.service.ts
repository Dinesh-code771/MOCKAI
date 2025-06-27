import { UserInfo } from '@common/types/auth.types';
import { EnvConfig } from '@config/env.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomJwtService {
  private readonly jwtTokenSecret: string;
  private readonly jwtTokenExpiry: number; 
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvConfig>,
  ) {
    this.jwtTokenSecret = this.configService.get<string>('JWT_TOKEN_SECRET');
    this.jwtTokenExpiry = this.configService.get<number>('JWT_TOKEN_EXPIRY');
  }

  async generateAuthToken(user: UserInfo, type: 'access' | 'temp' = 'access') {
    // Create the payload for the JWT token
    const payload = {
      sub: user.id,
      name: user.full_name,
      roles: user.roles,
      is_disabled: user.is_disabled,
      type
    };

    // Get the JWT secret from the configuration
    const secret = this.jwtTokenSecret;

    // Sign the payload to generate the JWT token
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.jwtTokenExpiry,
      secret,
    });

    // Return the generated authentication token
    return token;
  }

  async verifyAccessToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.jwtTokenSecret,
    });

    return payload;
  }
}
