import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';
import { CronOptions } from '@nestjs/schedule';

const configService = new ConfigService<EnvConfig>(process.env);

export function normalizeEmailCase(email: string): string {
  email = email.trim();

  const [localPart, domain] = email.split('@');

  return `${localPart.toLowerCase()}@${domain}`;
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}