import { APP_STRINGS } from '@common/strings';
import { EnvConfig } from '@config/env.config';
import { SendEmailResponse } from '@email/dto/send-email-response.dto';
import { SendEmailDto } from '@email/dto/send-email.dto';
import { EmailProvider } from '@email/interfaces/email-provider.interface';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sendgrid from '@sendgrid/mail';

/**
 * Service to send emails using SendGrid.
 * Implements the EmailProvider interface.
 */
@Injectable()
export class SendgridProvider implements EmailProvider {
  /**
   * Constructs the SendgridProvider.
   * @param configService - Service to access environment configuration.
   */
  constructor(private readonly configService: ConfigService<EnvConfig>) {
    sendgrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  /**
   * Sends an email using SendGrid.
   * @param data - The email data to be sent.
   * @returns A promise that resolves to a SendEmailResponse.
   * @throws ForbiddenException if the sender identity is not verified or authorization is invalid.
   * @throws InternalServerErrorException if there is an error sending the email.
   */
  async sendEmail(data: SendEmailDto): Promise<SendEmailResponse> {
    try {
      const emailData = {
        from: {
          email: data.from,
        },
        personalizations: [
          {
            ...(Array.isArray(data.to)
              ? { to: data.to.map((to) => ({ email: to })) }
              : { to: [{ email: data.to }] }),
            dynamic_template_data: data.templateData,
          },
        ],
        templateId: data.templateId,
      };

      const response = await sendgrid.send(emailData);

      if (response[0].statusCode === 202) {
        return {
          statusCode: 202,
          status: 'Success',
          message:
            APP_STRINGS.api_responses.email.providers.sendgrid
              .email_sent_successfully,
        };
      }
    } catch (e) {
      if (e.response) {
        Logger.error(
          `SendGrid API error response: ${JSON.stringify(e.response.body)}`,
          e.stack,
        );
      }

      Logger.error(e?.message, e?.stack);
      if (e.message === 'Forbidden') {
        throw new ForbiddenException(
          APP_STRINGS.api_errors.email.providers.sendgrid.the_from_address_does_not_match_a_verified_sender_identity,
        );
      }
      if (e.message === 'Unauthorized') {
        throw new ForbiddenException(
          APP_STRINGS.api_errors.email.providers.sendgrid.the_provided_authorization_grant_is_invalid_expired_or_revoked,
        );
      }

      throw new InternalServerErrorException(
        APP_STRINGS.api_errors.email.providers.sendgrid.error_sending_email(
          e.message,
        ),
      );
    }
  }
}
