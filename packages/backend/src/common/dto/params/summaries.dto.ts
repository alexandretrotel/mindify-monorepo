import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SearchSummariesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The search query',
    example: 'lorem ipsum',
  })
  query: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The language code',
    example: 'en',
  })
  languageCode: string;
}
