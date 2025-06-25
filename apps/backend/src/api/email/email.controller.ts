import { AuthType } from '@common/enums/auth-type.enum';
import { SendEmailDto } from '@email/dto/send-email.dto';
import { EmailService } from '@email/email.service';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiExcludeController,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { RouteNames } from '@common/route-names';

/**
 * Controller for handling email-related operations.
 */
@Controller(RouteNames.EMAIL)
@ApiTags('Email')
@ApiExcludeController()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Sends an email based on the provided data.         
   * @param data The email data to be sent
   * @returns A promise that resolves when the email is sent
   */
  @Post(RouteNames.EMAIL_SEND)
  @ApiOperation({
    summary: 'Send an email',
    description: 'Sends an email using the provided data',
  })
  @ApiBody({ type: SendEmailDto, description: 'The email data to be sent' })
  @ApiResponse({
    status: 202,
    description: 'Email has been successfully queued for sending',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid email data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Failed to send email',
  })
  async sendEmail(@Body() data: SendEmailDto) {
    return this.emailService.sendEmail(data);
  }
}
