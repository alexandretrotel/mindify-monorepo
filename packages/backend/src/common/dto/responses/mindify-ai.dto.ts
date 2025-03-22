import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class ChatDto {
  @IsString()
  @ApiProperty({
    description: 'The chat message',
    example: 'Hello',
  })
  created_at: string;

  @IsNumber()
  @ApiProperty({
    description: 'The chat message',
    example: 1,
  })
  id: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'The chat message',
    example: 1,
  })
  summary_id: number;

  @IsUUID()
  @ApiProperty({
    description: 'The chat message',
    example: '123e4567-e34b-12d3-a456-426614174000',
  })
  user_id: string;
}
