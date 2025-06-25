import { EnvConfig } from '@config/env.config';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';

@Injectable()
export class DBService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pgClient: Client;
  constructor(
    private config: ConfigService<EnvConfig>,
  ) {
    const databaseUrl = config.get<string>('DATABASE_URL');
    Logger.log('Connecting to PostgreSQL with URL:', databaseUrl);

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    this.pgClient = new Client({
      connectionString: databaseUrl,
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.pgClient.connect();

    this.pgClient.on('notification', async (msg) => {
    });

    await this.pgClient.query('LISTEN analytics_events');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pgClient.end();
  }
}
