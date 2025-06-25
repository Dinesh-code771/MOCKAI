import { ApiPropertyOptional } from '@nestjs/swagger';

export class DataDto {
  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  url?: string | null;

  @ApiPropertyOptional({ example: 'etag' })
  etag?: string | null;

  @ApiPropertyOptional({ example: 'fileName' })
  fileName?: string | null;
}
