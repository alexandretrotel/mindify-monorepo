import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, Min, Max, IsNumberString } from 'class-validator';
import { Grade } from 'ts-fsrs';

export class UpdateSrsDataDto {
  @IsNumberString()
  @ApiProperty({
    description: 'The mind ID',
    example: 1,
  })
  mindId: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e3b-12d3-a456-426614174000',
  })
  userId: string;

  @IsNumberString()
  @Min(1)
  @Max(4)
  @ApiProperty({
    description: 'The grade',
    example: 1,
  })
  grade: Grade;
}

export class PostUserLearningSessionDto {
  @IsNumberString()
  @ApiProperty({
    description: 'The total time in milliseconds',
    example: 420000,
  })
  totalTimeInMs: number;

  @IsNumberString()
  @ApiProperty({
    description: 'The number of cards',
    example: 10,
  })
  totalLength: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e4b-12d3-a456-426614174000',
  })
  userId: string;
}
