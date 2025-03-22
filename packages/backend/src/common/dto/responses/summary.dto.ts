import { IsNumber, IsObject, IsString } from 'class-validator';
import { SourceType } from 'src/common/types/summary';
import { ChaptersDto } from './chapters.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SummaryDto {
  @IsNumber()
  @ApiProperty({
    description: 'The summary id',
    example: 1,
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'The summary title',
    example: 'This is a summary title',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'The summary image url',
    example: 'https://example.com/image.jpg',
  })
  image_url: string;

  @IsString()
  @ApiProperty({
    description: 'The summary source type',
    example: 'book',
  })
  source_type: SourceType;

  @IsString()
  @ApiProperty({
    description: 'The summary source url',
    example: 'https://example.com/source',
  })
  source_url: string;

  @IsNumber()
  @ApiProperty({
    description: 'The summary reading time',
    example: 10,
  })
  reading_time: number;

  @IsString()
  @ApiProperty({
    description: 'The summary created at',
    example: '2021-09-01T00:00:00.000Z',
  })
  created_at: string;

  @IsString()
  @ApiProperty({
    description: 'The summary author name',
    example: 'John Doe',
  })
  author_name: string;

  @IsString()
  @ApiProperty({
    description: 'The summary author description',
    example: 'This is a summary author description',
  })
  author_description: string;

  @IsString()
  @ApiProperty({
    description: 'The summary topic name',
    example: 'Productivity',
  })
  topic_name: string;
}

export class SummaryWithChaptersDto extends SummaryDto {
  @IsObject()
  @ApiProperty({
    description: 'The summary chapters',
    example: {
      chapters: {
        1: 'Chapter 1',
      },
    },
  })
  chapters: ChaptersDto;
}

export class SummaryRatingDto {
  @IsNumber()
  @ApiProperty({
    description: 'The summary rating',
    example: 4.5,
  })
  rating: number;
}
