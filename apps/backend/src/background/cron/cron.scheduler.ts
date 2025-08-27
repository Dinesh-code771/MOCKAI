import { CronQueue } from '@cron/cron.queue';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronScheduler implements OnModuleInit {
  private readonly logger = new Logger(CronScheduler.name);
  constructor(private readonly cronQueue: CronQueue) {}

  async onModuleInit() {
    this.logger.debug('CronScheduler initialized');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Kolkata',
  })
  async scheduleDailyTasks() {
    this.logger.debug('Starting daily scheduled tasks');
  }

  @Cron(CronExpression.EVERY_4_HOURS, {
    timeZone: 'Asia/Kolkata',
  })
  async jobForEvery4Hours() {
    this.logger.debug('Starting job for every 4 hours');
    await this.cronQueue.addAssessPendingAssessmentsJob();
  }
}
