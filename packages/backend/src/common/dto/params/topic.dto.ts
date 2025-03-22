import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class TopicIdDto {
  @IsNumberString()
  @ApiProperty({
    description: 'The topic ID',
    example: 1,
  })
  topicId: number;
}

export class TopicIdLanguageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The language code',
    example: 'en',
  })
  languageCode: string;

  @IsNumberString()
  @ApiProperty({
    description: 'The topic ID',
    example: 1,
  })
  topicId: number;
}
