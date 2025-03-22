import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class UpdateUserTopicsDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e3b-12d3-a456-426614174000',
  })
  userId: string;

  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'The selected topics',
    example: [1, 2, 3],
  })
  selectedTopics: number[];
}
