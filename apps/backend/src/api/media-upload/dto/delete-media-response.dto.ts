import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DataDto } from '@media-upload/dto/data.dto';

export class DeleteMediaResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Media deleted successfully' })
  message: string;

  @ApiPropertyOptional({ required: false, nullable: true })
  data?: T;
}

export class DeleteMediaApiResponseDto extends DeleteMediaResponseDto<DataDto> {
  @ApiPropertyOptional({ type: DataDto })
  declare data?: DataDto;
}
