import { Enums } from './supabase';

export type NotificationType = Enums<'notifications_type'>;

export interface NotificationData {
  friend_id?: string; // The unique identifier of the friend. (type: friend_request | friend_read_summary | friend_saved_summary | friend_request_accepted)
  mind_id?: number; // The unique identifier of the mind. (type: flashcards_due)
  summary_id?: number; // The unique identifier of the summary. (type: new_summary)
  deeplink?: string; // The deeplink to the resource.
}
