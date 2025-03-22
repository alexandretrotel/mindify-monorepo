import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class ChaptersIdDto {
  @IsNumberString()
  @ApiProperty({
    description: 'The chapter ID',
    example: 1,
  })
  chapterId: number;
}
