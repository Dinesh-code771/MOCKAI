import { Injectable, Logger } from '@nestjs/common';
import { LoginDto } from '@auth/dto/login.dto';
import { DBService } from '@db/db.service';
import { OAuthDto } from '@auth/dto/oauth-input.dto';
import { OAuthEnum } from '@common/enums/oauth-providers.enum';
import { RoleType } from '@common/enums/auth-type.enum';

@Injectable()
export class AuthDBRepository {
  constructor(private readonly prisma: DBService) {}

  async findUserByEmailWithOtpDetails(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
      include: {
        user_otps: true,
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });
  }

  async findUserById(id: string) {
    return this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        full_name: true,
        phone_number: true,
        is_active: true,
        user_roles: {
          select: {
            roles: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async createUser(input: LoginDto, otp: string) {
    return this.prisma.users.create({
      data: {
        email: input.email,
        password_hash: input.password,
        is_temp: true,
        user_otps: {
          create: {
            otp_value: otp,
            expires_at: new Date(Date.now() + 15 * 60 * 1000),
          },
        },
        user_roles: {
          create: {
            roles: {
              connect: { name: RoleType.STUDENT },
            },
          },
        },
      },
      include: {
        user_roles: {
          include: {
            roles: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updateUserWithOtp(
    userId: string,
    hashedPassword: string,
    otp: string,
    resendAttempts: number,
  ) {
    try {
      return this.prisma.$transaction(async (tx) => {
        const user = await tx.users.update({
          where: { id: userId },
          data: {
            password_hash: hashedPassword,
          },
          include: {
            user_roles: {
              include: {
                roles: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        const otpData = await tx.user_otps.upsert({
          where: {
            user_id: userId,
          },
          update: {
            otp_value: otp,
            expires_at: new Date(Date.now() + 15 * 60 * 1000),
            attempts: 0,
            resend_at: new Date(),
            resend_attempts: resendAttempts,
            locked_at:
              resendAttempts && resendAttempts >= 5 ? new Date() : null,
          },
          create: {
            user_id: userId,
            otp_value: otp,
            resend_at: new Date(),
            expires_at: new Date(Date.now() + 15 * 60 * 1000),
          },
        });

        return {
          user,
          otpData,
        };
      });
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getOtp(id: string) {
    return await this.prisma.user_otps.findUnique({
      where: {
        user_id: id,
      },
      include: {
        users: {
          include: {
            user_roles: {
              include: {
                roles: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async upsertOtp(userId: string, otp: string, resendAttempts: number) {
    return this.prisma.user_otps.upsert({
      where: { user_id: userId },
      update: {
        otp_value: otp,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
        attempts: 0,
        resend_at: new Date(),
        resend_attempts: resendAttempts,
        locked_at: resendAttempts && resendAttempts >= 5 ? new Date() : null,
      },
      create: {
        user_id: userId,
        otp_value: otp,
        resend_at: new Date(),
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
  }

  async incrementOtpAttempts(otpId: string, attempts: number) {
    return await this.prisma.user_otps.update({
      where: {
        id: otpId,
      },
      data: {
        attempts,
        locked_at: attempts >= 5 ? new Date() : null,
      },
    });
  }

  async deleteOtpByUserId(userId: string) {
    return await this.prisma.user_otps.delete({
      where: {
        user_id: userId,
      },
    });
  }

  async updateUserIsTemp(userId: string, isTemp: boolean) {
    return await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        is_temp: isTemp,
      },
    });
  }

  async upsertOAuthUser(userData: OAuthDto, provider: OAuthEnum) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.users.findUnique({
        where: {
          email: userData.email,
        },
      });

      const upsertedUser = await tx.users.upsert({
        where: {
          email: userData.email,
        },
        update: {
          is_temp: false,
          full_name: userData.full_name,
          is_email_verified: true,
          ...(user && user.is_temp ? { password_hash: null } : {}),
        },
        create: {
          avatar: userData.avatar,
          email: userData.email,
          full_name: userData.full_name,
          is_email_verified: true,
          is_temp: false,
          user_roles: {
            create: {
              roles: {
                connect: {
                  name: RoleType.STUDENT,
                },
              },
            },
          },
        },
        include: {
          user_roles: {
            include: {
              roles: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      await tx.user_social_accounts.upsert({
        where: {
          user_id_provider_name: {
            user_id: upsertedUser.id,
            provider_name: provider,
          },
        },
        create: {
          user_id: upsertedUser.id,
          provider_name: provider,
          provider_id: userData.provider_id,
        },
        update: {},
      });

      return upsertedUser;
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
      include: {
        user_roles: {
          include: {
            roles: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return this.prisma.users.update({
      where: { id: userId },
      data: { password_hash: hashedPassword },
      include: {
        user_roles: {
          include: {
            roles: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async createForgotPasswordOtp(userId: string, otp: string) {
    return this.prisma.user_otps.upsert({
      where: { user_id: userId },
      update: {
        otp_value: otp,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
        attempts: 0,
        resend_at: new Date(),
        resend_attempts: 0,
        locked_at: null,
      },
      create: {
        user_id: userId,
        otp_value: otp,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
        attempts: 0,
        resend_at: new Date(),
        resend_attempts: 0,
      },
    });
  }
}
