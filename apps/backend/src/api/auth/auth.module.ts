import { Module } from '@nestjs/common';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { AuthTransform } from '@auth/auth.transform';
import { DBModule } from '@db/db.module';
import { HashingService } from '@common/hashing/hashing.service';
import { BcryptService } from '@common/hashing/bcrypt.service';
import { CustomJwtService } from '@common/services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '@auth/strategies/authentication/jwt-token/jwt-auth.guard';
import { JwtStrategy } from '@auth/strategies/authentication/jwt-token/jwt.strategy';
import { GoogleStrategy } from '@auth/strategies/social-auth/google/google.strategy';
import { GoogleOAuthGuard } from '@auth/strategies/social-auth/google/google.guard';
import { CookieService } from '@common/services/cookie.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '@auth/strategies/authentication/authentication.guard';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ session: false }),
    DBModule,
  ],
  controllers: [AuthController],
  providers: [
    CustomJwtService,
    AuthService,
    AuthTransform,
    JwtAuthGuard,
    JwtStrategy,
    GoogleStrategy,
    GoogleOAuthGuard,
    CookieService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AuthModule {}
