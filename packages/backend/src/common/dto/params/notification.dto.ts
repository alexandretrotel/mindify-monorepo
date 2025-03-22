import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumberString,
  IsString,
  IsNotEmpty,
  IsObject,
  IsNotEmptyObject,
} from 'class-validator';
import {
  NotificationData,
  NotificationType,
} from 'src/common/types/notification';

export class NotificationIdDto {
  @IsNumberString()
  @ApiProperty({
    description: 'The notification ID',
    example: 1,
  })
  notificationId: number;
}

export class UserNotificationDto extends NotificationIdDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e4b-12d3-a456-426614174000',
  })
  userId: string;
}

export class NotificationDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID',
    example: '123e4567-e3b-12d3-a456-426614174000',
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The notification title',
    example: 'notification title',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The notification message',
    example: 'notification message',
  })
  message: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The notification type',
    example: 'friend_request',
  })
  type: NotificationType;

  @IsObject()
  @IsNotEmptyObject()
  @ApiProperty({
    description: 'The notification data',
    example: { friend_id: '123e4567-e3b-12d3-a456-426614174000' },
  })
  data: NotificationData;
}

export class NotificationBatchDto extends NotificationDto {
  @IsNumberString()
  @ApiProperty({
    description:
      'The number of minutes to wait before sending the notification of the same type',
    example: 10,
  })
  batch: number;
}
