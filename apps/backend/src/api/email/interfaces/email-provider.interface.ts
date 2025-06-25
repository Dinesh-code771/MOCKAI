import { SendEmailResponse } from '@email/dto/send-email-response.dto';
import { SendEmailDto } from '@email/dto/send-email.dto';

export interface EmailProvider {
  sendEmail(data: SendEmailDto): Promise<SendEmailResponse>;
}
