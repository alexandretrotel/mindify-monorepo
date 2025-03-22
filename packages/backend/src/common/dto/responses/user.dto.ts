import { ApiProperty } from '@nestjs/swagger';
import { UserMetadata } from '@supabase/supabase-js';
import { IsArray, IsNumber, IsObject, IsString, IsUUID } from 'class-validator';
import { Json } from 'src/common/types/supabase';

export class UserMetadataDto {
  @IsObject()
  @ApiProperty({
    description: 'The user metadata',
  })
  metadata: UserMetadata;
}

export class UserLevelDto {
  @IsNumber()
  @ApiProperty({
    description: 'The user level',
    example: 1,
  })
  xp: number;

  @IsNumber()
  @ApiProperty({
    description: 'The user level',
    example: 1,
  })
  level: number;

  @IsNumber()
  @ApiProperty({
    description: 'The user level',
    example: 100,
  })
  xp_for_next_level: number;

  @IsNumber()
  @ApiProperty({
    description: 'The user level',
    example: 100,
  })
  xp_of_current_level: number;

  @IsNumber()
  @ApiProperty({
    description: 'The user progression',
    example: 0.5,
  })
  progression: number;
}

export class UserFriendDto {
  @IsString()
  @ApiProperty({
    description: 'The user friend created at',
    example: '2021-10-10T10:10:10.000Z',
  })
  created_at: string;

  @IsUUID()
  @ApiProperty({
    description: 'The user friend id',
    example: '123e4567-e456-12d3-a456-426614174000',
  })
  friend_id: string;

  @IsObject()
  @ApiProperty({
    description: 'The user friend metadata',
  })
  raw_user_meta_data: Json;
}

export class UserFriendIdsDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @ApiProperty({
    description: 'The user friend ids',
    example: ['123e4567-e456-12d3-a456-426614174000'],
  })
  friendsIds: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  @ApiProperty({
    description: 'The user friend ids',
    example: ['123e4567-e456-12d3-a456-426614174000'],
  })
  askedFriendsIds: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  @ApiProperty({
    description: 'The user friend ids',
    example: ['123e4567-e456-12d3-a456-426614174000'],
  })
  requestedFriendsIds: string[];
}

export class UserPendingFriendsIdsDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @ApiProperty({
    description: 'The user pending friend ids',
    example: ['123e4567-e456-12d3-a456-426614174000'],
  })
  pendingFriendsIds: string[];
}

export class SearchUserDto {
  @IsUUID()
  @ApiProperty({
    description: 'The user id',
    example: '123e4567-e456-12d3-a456-426614174000',
  })
  id: string;

  @IsString()
  @ApiProperty({
    description: 'The user username',
    example: 'username',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'The user avatar',
    example: 'https://example.com/avatar.png',
  })
  avatar: string;
}
