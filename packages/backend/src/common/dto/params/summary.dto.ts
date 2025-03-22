import { ApiProperty } from '@nestjs/swagger';
import {
  Min,
  Max,
  IsUUID,
  IsString,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class SummaryIdDto {
  @IsNumberString()
  @ApiProperty({
    description: 'The summary ID',
    example: 1,
  })
  summaryId: number;
}

export class RateSummaryDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e3b-12d3-a456-426614174000',
  })
  userId: string;

  @IsNumberString()
  @ApiProperty({
    description: 'The summary ID',
    example: 1,
  })
  summaryId: number;

  @IsNumberString()
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'The rating',
    example: 5,
  })
  rating: number;
}

export class SummaryActionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e4b-12d3-a456-426614174000',
  })
  userId: string;

  @IsNumberString()
  @ApiProperty({
    description: 'The summary ID',
    example: 1,
  })
  summaryId: number;
}

export class SummaryActionLanguageCodeDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e4b-12d3-a456-426614174000',
  })
  userId: string;

  @IsNumberString()
  @ApiProperty({
    description: 'The summary ID',
    example: 1,
  })
  summaryId: number;

  @IsString()
  @ApiProperty({
    description: 'The language code',
    example: 'fr',
  })
  languageCode: string;
}
