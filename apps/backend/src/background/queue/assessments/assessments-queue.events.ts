import { QueueName } from '@bg/constants/job.constant';
import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

@QueueEventsListener(QueueName.ASSESSMENTS)
export class AssessmentsQueueEvents extends QueueEventsHost {
  private readonly logger = new Logger(AssessmentsQueueEvents.name);
  constructor() {
    super();
  }

  @OnQueueEvent('added')
  onAdded(job: { jobId: string; name: string }) {
    this.logger.debug(
      `Job added to Assessments queue: ${job.jobId}, Name: ${job.name}`,
      'AssessmentsQueueEvents',
    );
  }

  @OnQueueEvent('waiting')
  onWaiting(job: { jobId: string; prev?: string }) {
    this.logger.debug(
      `Job waiting in Assessments queue: ${job.jobId}`,
      'AssessmentsQueueEvents',
    );
  }

  @OnQueueEvent('active')
  onActive(job: { jobId: string; prev?: string }) {
    this.logger.debug(
      `Job active in Assessments queue: ${job.jobId}`,
      'AssessmentsQueueEvents',
    );
  }

  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string; returnvalue: string }) {
    this.logger.debug(
      `Job completed in Assessments queue: ${job.jobId}, Return Value: ${job.returnvalue}`,
      'AssessmentsQueueEvents',
    );
  }

  @OnQueueEvent('failed')
  onFailed(job: { jobId: string; failedReason: string; prev?: string }) {
    this.logger.error(
      `Job failed in Assessments queue: ${job.jobId}, Reason: ${job.failedReason}`,
      'AssessmentsQueueEvents',
    );
  }

  @OnQueueEvent('retries-exhausted')
  onRetriesExhausted(job: { jobId: string; attemptsMade: number }) {
    this.logger.warn(
      `Job retries exhausted in Assessments queue: ${job.jobId}, Attempts Made: ${job.attemptsMade}`,
      'AssessmentsQueueEvents',
    );
  }
}
