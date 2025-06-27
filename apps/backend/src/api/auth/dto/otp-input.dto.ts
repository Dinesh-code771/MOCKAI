import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class OtpDto {
  @ApiProperty({ example: 123456 })
  @IsInt()
  @Min(100000)
  @Max(999999)
  @IsNotEmpty()
  otp: number;
}
