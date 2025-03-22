import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsUUID } from 'class-validator';

export class DeleteAllMessagesDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e3b-12d3-a456-426614174000',
  })
  userId: string;

  @IsNumberString()
  @ApiProperty({
    description: 'The chat ID',
    example: 1,
  })
  chatId: number;
}
