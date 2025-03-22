import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { FriendStatus } from 'src/common/types/friends';

export class FriendStatusDto {
  @IsString()
  @ApiProperty({
    description: 'The friend status',
    example: 'pending',
  })
  status: FriendStatus;
}
