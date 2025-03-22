import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SavePushTokenDto } from '../common/dto/params/notifications.dto';
import { UserIdDto } from '../common/dto/params/user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { NotificationDto } from '../common/dto/responses/notification.dto';
import { ActionDto } from '../common/dto/responses/general.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications' })
  @ApiResponse({ status: 200, type: NotificationDto, isArray: true })
  async getNotifications(): Promise<NotificationDto[]> {
    return this.notificationsService.getNotifications();
  }

  @Post('mark-all-as-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiBody({ type: UserIdDto })
  @ApiResponse({ status: 200, type: ActionDto })
  async markAllNotificationsAsRead(
    @Body() body: UserIdDto,
  ): Promise<ActionDto> {
    return this.notificationsService.markAllNotificationsAsRead(body.userId);
  }

  @Delete('delete-all/:userId')
  @ApiOperation({ summary: 'Delete all notifications' })
  @ApiParam({ name: 'userId', type: 'string', required: true })
  @ApiResponse({ status: 200, type: ActionDto })
  async deleteAllNotifications(@Param() body: UserIdDto): Promise<ActionDto> {
    return this.notificationsService.deleteAllNotifications(body.userId);
  }

  @Post('save-push-token')
  @ApiOperation({ summary: 'Save push token for user' })
  @ApiBody({ type: SavePushTokenDto, required: true })
  @ApiResponse({ status: 200, type: ActionDto })
  async saveTokenForUser(@Body() body: SavePushTokenDto): Promise<ActionDto> {
    return this.notificationsService.saveTokenForUser(body.userId, body.token);
  }
}
