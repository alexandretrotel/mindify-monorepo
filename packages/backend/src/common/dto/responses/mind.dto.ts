import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MindDto {
  @IsNumber()
  @ApiProperty({
    description: 'The mind id',
    example: 1,
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'The mind text',
    example: 'This is a mind text',
  })
  text: string;

  @IsString()
  @ApiProperty({
    description: 'The mind question',
    example: 'This is a mind question',
  })
  question: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The mind summary title',
    example: 'This is a mind summary title',
  })
  summary_title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The mind summary text',
    example: 'This is a mind summary text',
  })
  author_name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The mind summary text',
    example: 'This is a mind summary text',
  })
  topic_name?: string;

  @IsString()
  @ApiProperty({
    description: 'The mind created at',
    example: '2021-09-01T00:00:00.000Z',
  })
  created_at: string;
}
