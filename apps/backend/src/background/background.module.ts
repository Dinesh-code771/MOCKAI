import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_LIST } from '@bg/constants/job.constant';
import { BackgroundServiceManager } from '@bg/background-service-manager';
import { EmailQueueModule } from '@email-queue/email-queue.module';
import { CronModule } from '@cron/cron.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { RouteNames } from '@common/route-names';

@Module({
  imports: [
    BullModule.registerQueue(...QUEUE_LIST.map((name) => ({ name }))),
    EmailQueueModule,
    CronModule,
    BullBoardModule.forRoot({
      route: RouteNames.QUEUES_UI,
      adapter: ExpressAdapter,
      boardOptions: {
        uiConfig: {
          boardTitle: 'SaleMate Queues',
        },
      },
    }),
  ],
  providers: [BackgroundServiceManager],
  exports: [BackgroundServiceManager],
})
export class BackgroundModule {}
