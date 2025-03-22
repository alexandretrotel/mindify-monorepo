import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { NotificationType } from 'src/common/types/notification';
import { Json } from 'src/common/types/supabase';

export class NotificationDto {
  @IsNumber()
  @ApiProperty({
    description: 'The notification id',
    example: 1,
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'The notification title',
    example: 'This is a notification title',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'The notification message',
    example: 'This is a notification message',
  })
  message: string;

  @IsString()
  @ApiProperty({
    description: 'The notification type',
    example: 'friend_request',
  })
  type: NotificationType;

  @IsUUID()
  @ApiProperty({
    description: 'The notification user id',
    example: '123e4567-e34b-12d3-a456-426614174000',
  })
  user_id: string;

  @IsBoolean()
  @ApiProperty({
    description: 'The notification is read',
    example: false,
  })
  is_read: boolean;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    description: 'The notification data',
    example: { key: 'value' },
  })
  data: Json | null;
}
