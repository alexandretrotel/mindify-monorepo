import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsUUID } from 'class-validator';

export class MindUserDto {
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
}

export class MindIdDto {
  @IsNumberString()
  @ApiProperty({
    description: 'The mind ID',
    example: 1,
  })
  mindId: number;
}
