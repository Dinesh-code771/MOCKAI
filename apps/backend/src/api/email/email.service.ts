import { SendEmailResponse } from '@email/dto/send-email-response.dto';
import { SendEmailDto } from '@email/dto/send-email.dto';
import { EmailProvider } from '@email/interfaces/email-provider.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { APP_STRINGS } from '@common/strings';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(
    @Inject('EmailProvider') private readonly emailProvider: EmailProvider,
  ) {}

  async sendEmail(data: SendEmailDto): Promise<SendEmailResponse> {
    try {
      if (!data.to) {
        throw new Error(APP_STRINGS.api_errors.email.Email_address_is_required);
      }

      switch (data.templateId) {
        default:
          throw new Error(APP_STRINGS.api_errors.email.invalid_template_id);
      }
    } catch (error) {
      Logger.error(
        `Failed to send email with template ID ${data.templateId}: ${error.message}`,
        error.stack,
      );
      throw new Error(APP_STRINGS.api_errors.email.failed_to_send_email);
    }
  }
}
