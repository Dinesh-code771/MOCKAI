import { QueueName } from '@bg/constants/job.constant';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Injectable, Module } from '@nestjs/common';
import { DeadLetterQueueModule } from '@dead-letter-queue/dead-letter-queue.module';
import { AssessmentsQueueProcessor } from '@bg/queue/assessments/assessments-queue.processor';
import { AssessmentQueueService } from '@bg/queue/assessments/assessments-queue.service';
import { AssessmentsQueueEvents } from '@bg/queue/assessments/assessments-queue.events';
import { AssessmentsModule } from '@assessments/assessments.module';

@Injectable()
export class AssessmentQueueConfig {
  static getQueueConfig() {
    return BullModule.registerQueue({
      name: QueueName.ASSESSMENTS,
      streams: {
        events: {
          maxLen: 1000,
        },
      },
      defaultJobOptions: {
        removeOnFail: true,
        removeOnComplete: {
          age: 1 * 24 * 3600, // Keep for 1 day
        },
      },
    });
  }

  static getQueueUIConfig() {
    return BullBoardModule.forFeature({
      name: QueueName.ASSESSMENTS,
      adapter: BullMQAdapter,
      options: {
        readOnlyMode: process.env.NODE_ENV === 'production' || false,
        displayName: 'Assessments Queue',
        description: 'Queue for handling Assessment events',
      },
    });
  }
}

@Module({
  imports: [
    AssessmentQueueConfig.getQueueConfig(),
    AssessmentQueueConfig.getQueueUIConfig(),
    DeadLetterQueueModule,
    AssessmentsModule,
  ],
  providers: [AssessmentQueueService, AssessmentsQueueProcessor, AssessmentsQueueEvents],
  exports: [AssessmentQueueService],
})
export class AssessmentsQueueModule {}
