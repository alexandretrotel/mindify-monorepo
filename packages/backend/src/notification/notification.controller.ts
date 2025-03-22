import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  NotificationBatchDto,
  NotificationDto,
  NotificationIdDto,
} from '../common/dto/params/notification.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ActionDto } from '../common/dto/responses/general.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('mark-as-read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiBody({ type: NotificationIdDto })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully marked as read.',
    type: ActionDto,
  })
  async markNotificationAsRead(
    @Body() body: NotificationIdDto,
  ): Promise<ActionDto> {
    return this.notificationService.markNotificationAsRead(body.notificationId);
  }

  @Post('mark-as-unread')
  @ApiOperation({ summary: 'Mark notification as unread' })
  @ApiBody({ type: NotificationIdDto })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully marked as unread.',
    type: ActionDto,
  })
  async markNotificationAsUnread(
    @Body() body: NotificationIdDto,
  ): Promise<ActionDto> {
    return this.notificationService.markNotificationAsUnread(
      body.notificationId,
    );
  }

  @Delete('delete/:notificationId')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiParam({ name: 'notificationId', type: 'string', required: true })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully deleted.',
    type: ActionDto,
  })
  async deleteNotification(
    @Param() body: NotificationIdDto,
  ): Promise<ActionDto> {
    return this.notificationService.deleteNotification(body.notificationId);
  }

  @Post('store')
  @ApiOperation({ summary: 'Store notification' })
  @ApiBody({ type: NotificationDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully stored.',
    type: ActionDto,
  })
  async storeNotification(
    @Body() notificationDto: NotificationDto,
  ): Promise<ActionDto> {
    return this.notificationService.storeNotification(
      notificationDto.userId,
      notificationDto.title,
      notificationDto.message,
      notificationDto.type,
      notificationDto.data,
    );
  }

  @Post('send')
  @ApiOperation({ summary: 'Send notification' })
  @ApiBody({ type: NotificationDto, required: true })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully sent.',
    type: ActionDto,
  })
  async sendNotification(
    @Body() notificationBatchDto: NotificationBatchDto,
  ): Promise<ActionDto> {
    return this.notificationService.sendNotification(
      notificationBatchDto.userId,
      notificationBatchDto.title,
      notificationBatchDto.message,
      notificationBatchDto.type,
      notificationBatchDto.data,
      notificationBatchDto.batch,
    );
  }
}
