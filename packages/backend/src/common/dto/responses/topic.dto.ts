import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class TopicProgressionDto {
  @IsNumber()
  @ApiProperty({
    description: 'The topic ID',
    example: 1,
  })
  topicId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The topic progression',
    example: 1,
  })
  count: number;

  @IsNumber()
  @ApiProperty({
    description: 'The topic total',
    example: 1,
  })
  total: number;
}

export class TopicSummaryCount {
  @IsNumber()
  @ApiProperty({
    description: 'The topic ID',
    example: 1,
  })
  topicId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The topic summary count',
    example: 1,
  })
  count: number;
}
