import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FriendRequestDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The profile ID',
    example: '123e4567-e3b-12d3-a456-426614174000',
  })
  profileId: string;
}
