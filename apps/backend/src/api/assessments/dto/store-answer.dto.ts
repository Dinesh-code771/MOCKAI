import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class StoreAnswerDto {
  @ApiProperty({
    description: 'The answer to the question',
    example: 'The answer to the question',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}