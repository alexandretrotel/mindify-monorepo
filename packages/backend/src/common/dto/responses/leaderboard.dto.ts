import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsUUID,
} from 'class-validator';

export class LeaderboardDto {
  @IsNumber()
  @ApiProperty({
    description: 'The leaderboard length',
    example: 10,
  })
  length: number;

  @IsArray()
  @IsObject({ each: true })
  @ApiProperty({
    description: 'The leaderboard',
    example: [
      {
        user_id: '123e4567-e3b-12d3-a456-426614174000',
        xp: 100,
      },
    ],
  })
  leaderboard: LeaderboardUserDto[];
}

export class LeaderboardUserDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e456-12d3-a456-426614174000',
  })
  user_id: string;

  @IsNumber()
  @ApiProperty({
    description: 'The user XP',
    example: 100,
  })
  xp: number;
}
