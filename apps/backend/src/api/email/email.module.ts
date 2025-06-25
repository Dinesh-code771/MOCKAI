import { EmailController } from '@email/email.controller';
import { EmailService } from '@email/email.service';
import { SendgridProvider } from '@email/providers/send-grid.provider';
import { Module } from '@nestjs/common';

/**
 * @module EmailModule
 * @description Handles email-related functionality for the application.
 */
@Module({
  controllers: [EmailController],
  providers: [
    EmailService,
    {
      provide: 'EmailProvider',
      useClass: SendgridProvider,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
