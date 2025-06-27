import { Injectable } from '@nestjs/common';
import { AuthDBRepository } from '@db/auth/auth-db.repository';
import { LoginDto } from '@auth/dto/login.dto';
import { OAuthDto } from '@auth/dto/oauth-input.dto';
import { OAuthEnum } from '@common/enums/oauth-providers.enum';

@Injectable()
export class AuthDBService {
  constructor(private readonly authReposioty: AuthDBRepository) {}

  async findUserByEmailWithOtpDetails(email: string) {
    return this.authReposioty.findUserByEmailWithOtpDetails(email);
  }

  async findUserById(id: string) {
    return this.authReposioty.findUserById(id);
  }

  async createUser(input: LoginDto, otp: string) {
    return this.authReposioty.createUser(input, otp);
  }

  async updateUserWithOtp(
    userId: string,
    hashedPassword: string,
    otp: string,
    resendAttempts: number,
  ) {
    return this.authReposioty.updateUserWithOtp(
      userId,
      hashedPassword,
      otp,
      resendAttempts,
    );
  }

  async getOtp(id: string) {
    return this.authReposioty.getOtp(id);
  }

  async upsertOtp(userId: string, otp: string, resendAttempts: number) {
    return this.authReposioty.upsertOtp(userId, otp, resendAttempts);
  }

  async incrementOtpAttempts(otpId: string, attempts: number) {
    return this.authReposioty.incrementOtpAttempts(otpId, attempts);
  }

  async deleteOtpByUserId(userId: string) {
    return this.authReposioty.deleteOtpByUserId(userId);
  }

  async upsertOAuthUser(userData: OAuthDto, provider: OAuthEnum) {
    return this.authReposioty.upsertOAuthUser(userData, provider);
  }
}
