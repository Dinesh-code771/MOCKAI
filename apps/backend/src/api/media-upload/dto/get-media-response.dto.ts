import { DataDto } from '@media-upload/dto/data.dto';
import { UploadMediaResponseDto } from '@media-upload/dto/upload-media-response.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetMediaResponseDto extends UploadMediaResponseDto<DataDto> {
  @ApiPropertyOptional({ type: DataDto })
  declare data?: DataDto;
}
