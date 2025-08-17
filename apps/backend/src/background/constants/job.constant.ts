export enum QueueName {
  ASSESSMENTS = 'assessments',
  EMAIL = 'email',
  CRON = 'cron',
  DEAD_LETTER = 'dead_letter'
}

export const QUEUE_LIST = Object.values(QueueName).filter((v): v is QueueName =>
  Object.values(QueueName).includes(v as QueueName),
);

export enum QueuePrefix {
  USER = 'user',
  SYSTEM = 'system',
  ADMIN = 'admin',
}

export const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000 * 60, // 1 min. between retries
  },
  removeOnComplete: {
    age: 60 * 60 * 24, // ⏳ Keep for 1 day
    count: 5000, // max entries to keep
  },
  removeOnFail: {
    age: 60 * 60 * 24 * 7, // ⏳ Keep for 7 days
  },
};

export enum JobName {
  DLQ_FAILED_JOB = 'dlq_failed_job',
  ASSESSMENT_START_JOB = 'assessment_start_job',
  ASSESSMENT_END_JOB = 'assessment_end_job',
  ASSESS_INTERVIEW_JOB = 'assess_interview_job',
}

export enum CronJobName {
  ASSESS_PENDING_ASSESSMENTS = 'assess_pending_assessments',
}
