import { AuthDBService } from '@db/auth/auth-db.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto, LoginResponseDto } from '@auth/dto/login.dto';
import { HashingService } from '@common/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';
import { AuthTransform } from '@auth/auth.transform';
import { generateOtp } from '@common/helpers/helpers';
import { CustomJwtService } from '@common/services/jwt.service';
import { APP_STRINGS } from '@common/strings';
import { OAuthEnum } from '@common/enums/oauth-providers.enum';
import { OAuthDto } from './dto/oauth-input.dto';
import {
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  VerifyForgotPasswordOtpDto,
  VerifyForgotPasswordOtpResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
} from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  private isDevelopment;

  constructor(
    private readonly authDBService: AuthDBService,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService<EnvConfig>,
    private readonly authTransform: AuthTransform,
    private readonly jwtService: CustomJwtService,
  ) {
    this.isDevelopment = this.configService.get('NODE_ENV') === 'development';
  }

  async login(input: LoginDto): Promise<LoginResponseDto> {
    input.email = input.email?.toLowerCase();
    const user = await this.authDBService.findUserByEmailWithOtpDetails(
      input.email,
    );

    // create user if not exists
    if (!user) {
      input.password = await this.hashingService.hash(input.password);

      let otp = generateOtp();
      if (this.isDevelopment) {
        otp = '123456';
      }

      const newUser = await this.authDBService.createUser(input, otp);
      const parsedUser = this.authTransform.transformToUserResponse(newUser);
      const token = await this.jwtService.generateAuthToken(parsedUser, 'temp');

      // ToDo: send email

      return {
        is_temp: true,
        user: parsedUser,
        token,
      };
    }

    // if temp_user, update the password and send the email
    if (user.is_temp) {
      let resendAttempts: number | null = null;

      if (user.user_otps) {
        const otpData = user.user_otps;
        if (otpData?.locked_at) {
          const lockExpiry = new Date(
            otpData.locked_at.getTime() + 15 * 60 * 1000,
          );
          if (new Date() < lockExpiry) {
            throw new BadRequestException(
              APP_STRINGS.api_errors.auth.too_many_attempts,
            );
          }
        }
        if (otpData?.resend_at) {
          const resendExpiry = new Date(
            otpData.resend_at.getTime() + 1 * 60 * 1000,
          );
          if (new Date() < resendExpiry) {
            throw new BadRequestException(
              APP_STRINGS.api_errors.auth.too_many_attempts_after_1_minute,
            );
          }
        }
        resendAttempts = otpData?.resend_attempts
          ? otpData?.resend_attempts + 1
          : 0;
      }

      let otp = generateOtp();
      if (this.isDevelopment) {
        otp = '123456';
      }

      input.password = await this.hashingService.hash(input.password);

      const updatedUser = await this.authDBService.updateUserWithOtp(
        user.id,
        input.password,
        otp,
        resendAttempts,
      );

      // ToDo: send email

      const parsedUser = this.authTransform.transformToUserResponse(
        updatedUser.user,
      );
      const token = await this.jwtService.generateAuthToken(parsedUser, 'temp');

      return {
        is_temp: true,
        user: parsedUser,
        token,
      };
    }

    // check if password is correct
    const isPasswordCorrect = await this.hashingService.compare(
      input.password,
      user.password_hash,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.auth.invalid_password,
      );
    }

    const parsedUser = this.authTransform.transformToUserResponse(user);
    const token = await this.jwtService.generateAuthToken(parsedUser);

    return {
      is_temp: false,
      user: parsedUser,
      token,
    };
  }

  async resendOtp(userId: string) {
    const otpData = await this.authDBService.getOtp(userId);

    if (!otpData?.users) {
      throw new BadRequestException(APP_STRINGS.api_errors.auth.user_not_found);
    }

    let resendAttempts: number | null = null;

    if (otpData?.locked_at) {
      const lockExpiry = new Date(otpData.locked_at.getTime() + 15 * 60 * 1000);
      if (new Date() < lockExpiry) {
        throw new BadRequestException(
          APP_STRINGS.api_errors.auth.too_many_attempts,
        );
      }
    }
    if (otpData?.resend_at) {
      const resendExpiry = new Date(
        otpData.resend_at.getTime() + 1 * 60 * 1000,
      );
      if (new Date() < resendExpiry) {
        throw new BadRequestException(
          APP_STRINGS.api_errors.auth.too_many_attempts_after_1_minute,
        );
      }
    }
    resendAttempts = otpData?.resend_attempts
      ? otpData?.resend_attempts + 1
      : 0;

    let otp = generateOtp();
    if (this.isDevelopment) {
      otp = '123456';
    }

    // ToDo: send email

    return await this.authDBService.upsertOtp(userId, otp, resendAttempts);
  }

  async verifyOtp(userId: string, otp: string): Promise<LoginResponseDto> {
    const otpData = await this.authDBService.getOtp(userId);
    if (new Date(otpData.expires_at) < new Date()) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.auth.verification_code_expired,
      );
    }

    // Check if OTP is locked and if 15 minutes have passed
    if (otpData.locked_at) {
      const lockExpiry = new Date(otpData.locked_at.getTime() + 15 * 60 * 1000);
      if (new Date() < lockExpiry) {
        throw new BadRequestException(
          APP_STRINGS.api_errors.auth.too_many_attempts,
        );
      }
      // Reset attempts and locked_at if lock period has expired
      await this.authDBService.incrementOtpAttempts(otpData.id, 0);
      otpData.attempts = 0;
    }

    if (otpData.otp_value !== otp) {
      await this.authDBService.incrementOtpAttempts(
        otpData.id,
        otpData.attempts + 1,
      );
      throw new BadRequestException(APP_STRINGS.api_errors.auth.invalid_code);
    }

    // clear otp
    await this.authDBService.deleteOtpByUserId(userId);

    // set is_temp to false
    await this.authDBService.updateUserIsTemp(userId, false);

    const parsedUser = this.authTransform.transformToUserResponse(
      otpData.users,
    );
    const token = await this.jwtService.generateAuthToken(parsedUser);

    return {
      is_temp: false,
      user: parsedUser,
      token,
    };
  }

  async socialLogin(req: any, provider: OAuthEnum) {
    if (!req || !req.user) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.gloabal.invalid_request,
      );
    }

    const { email, full_name, avatar, provider_id } = req.user;

    const userData: OAuthDto = {
      email: email.toLowerCase(),
      full_name,
      avatar,
      provider_id,
    };

    const user = await this.authDBService.upsertOAuthUser(userData, provider);

    const parsedUser = this.authTransform.transformToUserResponse(user);
    const token = await this.jwtService.generateAuthToken(parsedUser);

    return {
      is_temp: false,
      user: parsedUser,
      token,
    };
  }

  async getLoggedInUser(userId: string) {
    const user = await this.authDBService.findUserById(userId);
    return this.authTransform.transformToUserResponse(user);
  }

  async forgotPassword(
    input: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    input.email = input.email?.toLowerCase();
    const user = await this.authDBService.findUserByEmail(input.email);

    if (!user) {
      throw new BadRequestException(APP_STRINGS.api_errors.auth.user_not_found);
    }

    if (user.is_temp) {
      throw new BadRequestException('Please complete your registration first');
    }

    let otp = generateOtp();
    if (this.isDevelopment) {
      otp = '123456';
    }

    // Create OTP for password reset
    await this.authDBService.createForgotPasswordOtp(user.id, otp);

    // Generate temporary token for password reset
    const parsedUser = this.authTransform.transformToUserResponse(user);
    const tempToken = await this.jwtService.generateAuthToken(
      parsedUser,
      'temp',
    );

    // TODO: Send email with OTP

    return {
      message: 'OTP sent successfully to your email',
      temp_token: tempToken,
    };
  }

  async verifyForgotPasswordOtp(
    userId: string,
    input: VerifyForgotPasswordOtpDto,
  ): Promise<VerifyForgotPasswordOtpResponseDto> {
    const otpData = await this.authDBService.getOtp(userId);

    if (!otpData) {
      throw new BadRequestException(APP_STRINGS.api_errors.auth.user_not_found);
    }

    if (new Date(otpData.expires_at) < new Date()) {
      throw new BadRequestException(
        APP_STRINGS.api_errors.auth.verification_code_expired,
      );
    }

    // Check if OTP is locked and if 15 minutes have passed
    if (otpData.locked_at) {
      const lockExpiry = new Date(otpData.locked_at.getTime() + 15 * 60 * 1000);
      if (new Date() < lockExpiry) {
        throw new BadRequestException(
          APP_STRINGS.api_errors.auth.too_many_attempts,
        );
      }
      // Reset attempts and locked_at if lock period has expired
      await this.authDBService.incrementOtpAttempts(otpData.id, 0);
      otpData.attempts = 0;
    }

    if (otpData.otp_value !== input.otp.toString()) {
      await this.authDBService.incrementOtpAttempts(
        otpData.id,
        otpData.attempts + 1,
      );
      throw new BadRequestException(APP_STRINGS.api_errors.auth.invalid_code);
    }

    // Clear OTP after successful verification
    await this.authDBService.deleteOtpByUserId(userId);

    // Generate access token
    const parsedUser = this.authTransform.transformToUserResponse(
      otpData.users,
    );
    const token = await this.jwtService.generateAuthToken(parsedUser);

    return {
      message: 'OTP verified successfully',
      token,
    };
  }

  async resetPassword(
    userId: string,
    input: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    // Hash the new password
    const hashedPassword = await this.hashingService.hash(input.new_password);

    // Update user password
    await this.authDBService.updatePassword(userId, hashedPassword);

    return {
      message: 'Password reset successfully',
    };
  }
}
