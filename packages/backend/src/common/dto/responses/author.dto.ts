import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthorDto {
  @IsString()
  @ApiProperty({
    description: 'The author name',
    example: 'John Doe',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'The author description',
    example: 'A great author',
  })
  description: string;
}
