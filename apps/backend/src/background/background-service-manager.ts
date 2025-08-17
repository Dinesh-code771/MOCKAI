import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { JobsOptions, Queue } from 'bullmq';
import {
  QueueName,
  JobName,
  DEFAULT_JOB_OPTIONS,
} from '@bg/constants/job.constant';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';

@Injectable()
export class BackgroundServiceManager {
  private readonly logger = new Logger(BackgroundServiceManager.name);
  constructor(
    @InjectQueue(QueueName.EMAIL) private emailQueue: Queue,
    @InjectQueue(QueueName.ASSESSMENTS) private assessmentsQueue: Queue,
  ) {}

  async addJob<T>(
    queue: Queue,
    jobName: JobName,
    data: T,
    options?: JobsOptions,
  ): Promise<void> {
    this.logger.debug(
      `Adding job ${jobName} to queue ${queue.name} with data: ${JSON.stringify(data)}`,
      'BackgroundServiceManager',
    );

    try {
      const job = await queue.add(jobName, data, {
        ...DEFAULT_JOB_OPTIONS,
        ...options,
      });
      this.logger.debug(
        `Job ${job.id} added successfully to queue ${queue.name}`,
        'BackgroundServiceManager',
      );
    } catch (error) {
      this.logger.error(
        `Error adding job ${jobName} to queue ${queue.name}: ${error.message}`,
        error.stack,
        'BackgroundServiceManager',
      );
      throw error;
    }
  }

  async removeAssessmentsQueueJob(jobId: string) {
    return this.assessmentsQueue.remove(jobId);
  }

  async assessmentStartJob(jobId: string, delay: number) {
    return this.addJob(
      this.assessmentsQueue,
      JobName.ASSESSMENT_START_JOB,
      {},
      {
        delay,
        jobId,
      },
    )
  }

  async assessmentEndJob(jobId: string, delay: number) {
    return this.addJob(
      this.assessmentsQueue,
      JobName.ASSESSMENT_END_JOB,
      {},
      {
        delay,
        jobId,
      },
    );
  }

  async assessInterviewJob(id: string, type?: AssessmentType) {
    return this.addJob(
      this.assessmentsQueue,
      JobName.ASSESS_INTERVIEW_JOB,
      { id, type },
    );
  }
}
