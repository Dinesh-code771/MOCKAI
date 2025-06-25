import { ApiProperty } from '@nestjs/swagger';

export class UploadMediaResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Media uploaded successfully' })
  message: string;

  @ApiProperty({ required: false, nullable: true })
  data?: T;
}
