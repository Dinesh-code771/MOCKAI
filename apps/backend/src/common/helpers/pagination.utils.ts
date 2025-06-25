import { EnvConfig } from '@config/env.config';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService<EnvConfig>();

// Parse default values as integers
const DEFAULT_PAGE = parseInt(configService.get<string>('DEFAULT_PAGE'), 10);
const DEFAULT_PAGE_SIZE = parseInt(
  configService.get<string>('DEFAULT_PAGE_SIZE'),
  10,
);


export function calculateSkipAndTake(page?: number, limit?: number) {
  page = (!page || page < 1 ) ? DEFAULT_PAGE : page;
  const take = (!limit || limit < 1) ? DEFAULT_PAGE_SIZE : limit;
  const skip = (page - 1) * take;
  return { skip, take };
}

export function getPaginatedData(
  totalCount: number,
  page?: number,
  limit?: number,
) {
  page = (!page || page < 1 ) ? DEFAULT_PAGE : page;
  limit = (!limit || limit < 1) ? DEFAULT_PAGE_SIZE : limit;
  const totalPages = Math.ceil(totalCount / limit);
  return { page, totalPages };
}
