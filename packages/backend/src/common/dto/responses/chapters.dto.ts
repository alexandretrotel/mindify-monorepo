import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ChaptersDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'The chapter titles',
    example: ['Chapter 1', 'Chapter 2'],
  })
  titles: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'The chapter texts',
    example: ['Text 1', 'Text 2'],
  })
  texts: string[];
}
