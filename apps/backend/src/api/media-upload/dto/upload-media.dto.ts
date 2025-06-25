import { ApiProperty } from '@nestjs/swagger';

export class UploadMediaDto {
  @ApiProperty()
  file: Express.Multer.File;
}
