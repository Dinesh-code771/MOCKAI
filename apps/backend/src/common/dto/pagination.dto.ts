import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginationDetailsDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  @IsNumber()
  pageNo: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  @IsNumber()
  pageSize: number;

  @ApiProperty({ description: 'Total number of items available', example: 100 })
  @IsNumber()
  totalCount: number;

  @ApiProperty({ description: 'Total number of pages available', example: 10 })
  @IsNumber()
  totalPages: number;
}
