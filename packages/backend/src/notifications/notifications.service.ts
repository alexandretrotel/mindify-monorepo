import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase';

@Injectable()
export class NotificationsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getNotifications() {
    const supabase = this.supabase.getClient();
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('id, title, message, type, user_id, is_read, data')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching notifications',
      );
    }

    return notifications;
  }

  async markAllNotificationsAsRead(userId: string) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while updating notifications',
      );
    }

    return {
      success: true,
      message: 'All notifications have been marked as read',
    };
  }

  async deleteAllNotifications(userId: string) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while deleting notifications',
      );
    }

    return { success: true, message: 'All notifications have been deleted' };
  }

  async saveTokenForUser(userId: string, expoPushToken: string) {
    const supabase = this.supabase.getClient();
    const { error } = await supabase.from('push_notification_tokens').insert({
      user_id: userId,
      expo_push_token: expoPushToken,
    });

    if (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while saving the token',
      );
    }

    return { success: true, message: 'The token has been saved' };
  }
}
