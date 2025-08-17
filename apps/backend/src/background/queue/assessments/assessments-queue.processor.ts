import { JobName, QueueName } from '@bg/constants/job.constant';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DeadLetterQueueService } from '@dead-letter-queue/dead-letter-queue.service';
import { APP_STRINGS } from '@common/strings';
import { AssessmentQueueService } from '@bg/queue/assessments/assessments-queue.service';
import { AssessmentType } from '@assessments/enum/assessment-type.enum';

@Processor(QueueName.ASSESSMENTS, {
  concurrency: 5,
  drainDelay: 300,
  stalledInterval: 300000, // 5 minutes
  maxStalledCount: 5,
  limiter: {
    max: 30,
    duration: 300,
  },
})
export class AssessmentsQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(AssessmentsQueueProcessor.name);
  constructor(
    private readonly assessmentsQueueService: AssessmentQueueService,
    private readonly dlqService: DeadLetterQueueService,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    let logString_ = `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`;
    this.logger.debug(logString_, 'AssessmentsQueueProcessor');
    this.safeJobLog(job, logString_);

    try {
      let result;
      switch (job.name) {
        case JobName.ASSESSMENT_START_JOB:
          await this.assessmentsQueueService.AssessmentStartJob(
            job.id.split(':')[1],
          );
          break;
        case JobName.ASSESSMENT_END_JOB:
          await this.assessmentsQueueService.AssessmentEndJob(
            job.id.split(':')[1],
          );
          break;
        case JobName.ASSESS_INTERVIEW_JOB:
          await this.assessmentsQueueService.AssessInterview(
            job.data.id as string,
            job.data.type as AssessmentType,
          );
          break;
        default:
          throw new Error(
            APP_STRINGS.background.queue.unknown_job_name(job.name),
          );
      }

      logString_ = `Completed job ${job.id} with result: ${JSON.stringify(result)}`;
      this.logger.debug(logString_, 'AssessmentsQueueProcessor');
      this.safeJobLog(job, logString_);

      return result;
    } catch (error) {
      this.logger.error(
        `Error processing job ${job.id} of type ${job.name}: ${error.message}`,
        error.stack,
        'AssessmentsQueueProcessor',
      );
      throw error;
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const logString_ = `Job ${job.id} has started processing`;
    this.logger.debug(logString_, 'AssessmentsQueueProcessor');
    this.safeJobLog(job, logString_);
  }

  @OnWorkerEvent('progress')
  async onProgress(job: Job) {
    this.logger.debug(`Job ${job.id} is ${job.progress}% complete`);
    this.safeJobLog(job, `Job ${job.id} is ${job.progress}% complete`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(
      `Job ${job.id} has been completed`,
      'AssessmentsQueueProcessor',
    );
    this.safeJobLog(job, `Job ${job.id} has been completed`);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    const logString_ = `Job ${job.id} has failed with reason: ${job.failedReason}`;
    this.logger.error(logString_, 'AssessmentsQueueProcessor');
    this.logger.error(job?.stacktrace);
    this.safeJobLog(job, logString_);

    // Push the failed job to the Dead Letter Queue
    if (job && (job.attemptsMade ?? 1) >= (job.opts?.attempts ?? 0)) {
      await this.dlqService.addFailedJobToDLQ({
        originalQueueName: QueueName.ASSESSMENTS,
        originalJobId: `job_no:${job.id}`,
        originalJobName: job.name,
        originalJobData: job.data,
        originalJobAttempts: job?.attemptsMade ?? 0,
        failedReason: job?.failedReason,
        stacktrace: job?.stacktrace,
        timestamp: Date.now(),
      });
    }
  }

  @OnWorkerEvent('stalled')
  async onStalled(job: Job) {
    this.logger.warn(`Job ${job.id} has stalled`, 'AssessmentsQueueProcessor');
    this.safeJobLog(job, `Job ${job.id} has stalled`);

    // Considering stalled jobs to DLQ if they are consistently stalling
    if (job && (job.attemptsMade ?? 1) >= (job.opts?.attempts ?? 0)) {
      await this.dlqService.addFailedJobToDLQ({
        originalQueueName: QueueName.ASSESSMENTS,
        originalJobId: `job_no:${job.id}`,
        originalJobName: job.name,
        originalJobData: job.data,
        originalJobAttempts: job?.attemptsMade ?? 0,
        failedReason: `Job stalled for too long. Current attempts: ${job?.attemptsMade}`,
        stacktrace: job?.stacktrace,
        timestamp: Date.now(),
      });
    }
  }

  @OnWorkerEvent('error')
  async onError(job: Job, error: Error) {
    const logString_ = `Job ${job.id} has failed with worker error: ${error?.message}`;
    this.logger.error(logString_, error.stack, 'AssessmentsQueueProcessor');
    this.safeJobLog(job, logString_);

    // Errors to DLQ as well
    if (job && (job.attemptsMade ?? 1) >= (job.opts?.attempts ?? 0)) {
      await this.dlqService.addFailedJobToDLQ({
        originalQueueName: QueueName.ASSESSMENTS,
        originalJobId: `job_no:${job.id}`,
        originalJobName: job.name,
        originalJobData: job.data,
        originalJobAttempts: job?.attemptsMade ?? 0,
        failedReason: `Processor error: ${error?.message}`,
        stacktrace: error.stack ? error.stack.split('\n') : [],
        timestamp: Date.now(),
      });
    }
  }

  private safeJobLog(job: Job, message: string) {
    try {
      if (typeof job.log === 'function') job.log(message);
    } catch (logErr) {
      this.logger.warn(
        `Failed to log job ${job.id}: ${logErr?.message}`,
        'AssessmentsQueueProcessor',
      );
    }
  }
}
