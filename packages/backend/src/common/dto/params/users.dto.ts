import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchUsersDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The search query',
    example: 'lorem ipsum',
  })
  query: string;
}
