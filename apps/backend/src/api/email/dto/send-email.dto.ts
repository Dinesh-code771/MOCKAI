import { EmailTemplateType } from '@email/enums/email-template.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  to: string | string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  from: string;

  @IsNotEmpty()
  // @IsEnum(EmailTemplateType)
  @ApiProperty({
    enum: new EmailTemplateType(),
    example: Object.keys(EmailTemplateType),
  })
  templateId: string;

  @IsNotEmpty()
  @ApiProperty({ type: () => Object })
  templateData: any;
}
