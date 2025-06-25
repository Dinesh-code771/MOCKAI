import { CronJobName, QueueName } from '@bg/constants/job.constant';

export interface ICronJob {
  jobType: CronJobName;
  data?: any;
  options?: {
    priority?: number;
    timestamp?: number;
  };
}

export interface IDLQFailedJobData {
  originalQueueName: QueueName;
  originalJobId: string;
  originalJobName: string;
  originalJobData: any;
  failedReason: string;
  originalJobAttempts?: number;
  stacktrace?: string[];
  timestamp: number;
}
