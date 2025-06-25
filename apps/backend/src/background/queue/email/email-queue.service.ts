import { EmailService } from '@email/email.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailQueueService {
  private readonly logger = new Logger(EmailQueueService.name);
  constructor(private readonly emailService: EmailService) {}
}
