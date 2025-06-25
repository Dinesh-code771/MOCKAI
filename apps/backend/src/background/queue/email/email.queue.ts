import { QueueName } from '@bg/constants/job.constant';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EmailQueue {
  private readonly logger = new Logger(EmailQueue.name);
  constructor(@InjectQueue(QueueName.EMAIL) private emailQueue: Queue) {}
}
