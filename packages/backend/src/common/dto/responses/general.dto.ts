import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class ActionDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @IsString()
  @ApiProperty({
    description: 'Message',
    example: 'The action has been successfully completed.',
    required: false,
  })
  message: string;
}

export class BooleanDto {
  @IsBoolean()
  @ApiProperty({
    description: 'Boolean value',
    example: true,
  })
  value: boolean;
}

export class BooleansDto {
  @IsArray()
  @IsBoolean({ each: true })
  @ApiProperty({
    description: 'Boolean values',
    example: [true, false, true],
  })
  values: boolean[];
}

export class CountDto {
  @IsNumber()
  @ApiProperty({
    description: 'The count',
    example: 5,
  })
  count: number;
}

export class IdDto {
  @IsNumber()
  @ApiProperty({
    description: 'The ID',
    example: 1,
  })
  id: number;
}

export class NameDto {
  @IsString()
  @ApiProperty({
    description: 'The name',
    example: 'John Doe',
  })
  name: string;
}

export class TitleDto {
  @IsString()
  @ApiProperty({
    description: 'The title',
    example: 'The Title',
  })
  title: string;
}

export class TimestampDto {
  @IsString()
  @ApiProperty({
    description: 'The timestamp',
    example: '2021-01-01T00:00:00.000Z',
  })
  timestamp: string;
}

export class TimestampsDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'The timestamps',
    example: ['2021-01-01T00:00:00.000Z', '2021-01-02T00:00:00.000Z'],
  })
  timestamps: string[];
}
