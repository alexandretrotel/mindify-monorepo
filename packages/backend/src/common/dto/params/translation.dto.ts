import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsUUID,
  IsNumberString,
} from 'class-validator';

export class LanguageCodeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The language code',
    example: 'en',
  })
  languageCode: string;
}

export class LanguageCodeIdDto {
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @IsNumberString()
  id: number;
}

export class LanguageCodeUserIdDto {
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class LanguageCodeIdsDto {
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @IsArray()
  @IsNumberString({}, { each: true })
  ids: number[];
}
