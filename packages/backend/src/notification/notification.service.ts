import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Expo from 'expo-server-sdk';
import { ExpoService } from '../common/expo/expo.service';
import { SupabaseService } from '../common/supabase';
import {
  NotificationData,
  NotificationType,
} from '../common/types/notification';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly expoService: ExpoService,
    private readonly user: UserService,
  ) {}

  async markNotificationAsRead(notificationId: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the notification.',
      );
    }

    return { success: true, message: 'Notification marked as read.' };
  }

  async markNotificationAsUnread(notificationId: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: false })
      .eq('id', notificationId);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating the notification.',
      );
    }

    return { success: true, message: 'Notification marked as unread.' };
  }

  async deleteNotification(notificationId: number) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while deleting the notification.',
      );
    }

    return { success: true, message: 'Notification deleted successfully.' };
  }

  async storeNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data: NotificationData,
  ) {
    const supabase = this.supabase.getClient();

    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      type,
      data: JSON.stringify(data),
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while storing the notification.',
      );
    }

    return {
      success: true,
      message: 'Notification stored successfully.',
    };
  }

  async sendNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data: NotificationData,
    batch: number = 5, // 5 minutes batch by default (e.g. 5 minutes between each notification of the same type)
  ) {
    const supabase = this.supabase.getClient();

    const { data: recentNotifications, error: recentError } = await supabase
      .from('notifications')
      .select('*')
      .match({ user_id: userId, type })
      .gte(
        'created_at',
        new Date(Date.now() - batch * 60 * 1000).toISOString(),
      );

    if (recentError) {
      console.error(recentError);
      throw new InternalServerErrorException(
        'An error occurred while fetching recent notifications.',
      );
    }

    if (recentNotifications && recentNotifications.length > 0) {
      return {
        success: true,
        message: 'Notification skipped due to batch limit.',
      };
    }

    const { data: tokensData, error } = await supabase
      .from('push_notification_tokens')
      .select('expo_push_token')
      .eq('user_id', userId);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching the user push notification tokens.',
      );
    }

    if (!tokensData || tokensData.length === 0) {
      return {
        success: true,
        message: 'No push notification tokens found.',
      };
    }

    const tokens = tokensData.map((tokenRecord) => tokenRecord.expo_push_token);

    const messages = [];
    for (const token of tokens) {
      if (!Expo.isExpoPushToken(token)) {
        console.error(`Push token ${token} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: token,
        sound: 'default',
        title: title,
        body: message,
        data: {
          type,
          ...data,
        },
      });
    }

    const expo = this.expoService.expo;
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    await this.storeNotification(userId, title, message, type, data);

    return {
      success: true,
      message: 'Notifications sent successfully.',
    };
  }

  async notifyFriendRequest(userId: string, profileId: string) {
    const { metadata } = await this.user.getUserMetadata(userId);
    const name = metadata?.name;

    await this.sendNotification(
      profileId,
      "Demande d'ami",
      `${name} vous a envoyé une demande d'ami.`,
      'friend_request',
      {
        friend_id: userId,
        deeplink: `mindify://profile/${userId}`,
      },
      1,
    );

    return {
      success: true,
      message: 'Friend request notification sent successfully.',
    };
  }

  async notifyFriendRequestAccepted(userId: string, profileId: string) {
    const { metadata } = await this.user.getUserMetadata(userId);
    const name = metadata?.name;

    await this.sendNotification(
      profileId,
      "Demande d'ami acceptée",
      `${name} a accepté votre demande d'ami.`,
      'friend_request_accepted',
      {
        friend_id: userId,
        deeplink: `mindify://profile/${userId}`,
      },
      1,
    );

    return {
      success: true,
      message: 'Friend request accepted notification sent successfully.',
    };
  }

  async notifyFriendReadSummary(
    userId: string,
    summaryId: number,
    summaryTitle: string,
  ) {
    const { friendsIds } = await this.user.getFriendIds(userId);

    const { metadata } = await this.user.getUserMetadata(userId);
    const name = metadata?.name;

    for (const friendId of friendsIds) {
      try {
        await this.sendNotification(
          friendId,
          'Résumé lu',
          `${name} a lu le résumé ${summaryTitle}.`,
          'friend_read_summary',
          {
            friend_id: userId,
            deeplink: `mindify://summary/preview/${summaryId}`,
          },
          30,
        );
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    return {
      success: true,
      message: 'Friend read summary notification sent successfully.',
    };
  }

  async notifyFriendSavedSummary(
    userId: string,
    summaryId: number,
    summaryTitle: string,
  ) {
    const { friendsIds } = await this.user.getFriendIds(userId);

    const { metadata } = await this.user.getUserMetadata(userId);
    const name = metadata?.name;

    for (const friendId of friendsIds) {
      try {
        await this.sendNotification(
          friendId,
          'Résumé enregistré',
          `${name} a enregistré le résumé ${summaryTitle}.`,
          'friend_saved_summary',
          {
            friend_id: userId,
            deeplink: `mindify://summary/preview/${summaryId}`,
          },
          30,
        );
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    return {
      success: true,
      message: 'Friend saved summary notification sent successfully.',
    };
  }
}
