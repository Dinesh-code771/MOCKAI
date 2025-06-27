import { ApiProperty } from "@nestjs/swagger";

export class RoleDto {
  @ApiProperty({
    description: 'The unique identifier for the role.',
    example: 'e59df79a-dac9-4cc5-b2b4-0dde78af2a90',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the role.',
    example: 'user',
  })
  name: string;
}