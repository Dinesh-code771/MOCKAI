import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  status: string;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ required: false, nullable: true })
  data?: T;

  @ApiProperty({ required: false, nullable: true })
  error?: string;

  @ApiProperty({ required: false, nullable: true })
  meta?: any;
}
