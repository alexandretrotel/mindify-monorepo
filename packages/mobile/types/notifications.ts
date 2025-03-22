import type { Tables } from "@/types/supabase";

/**
 * Enum representing different types of notifications.
 *
 * @enum {string}
 */
export enum NotificationType {
  FriendRequest = "friend_request", // Represents a friend request notification.
  Summary = "summary", // Represents a summary notification.
  FlashcardsDue = "flashcards_due", // Represents a notification for due flashcards.
}

/**
 * Enum representing the various actions that can be taken on a notification.
 *
 * @enum {string}
 */
export enum NotificationActionType {
  Accept = "accept", // Action to accept a friend request.
  Reject = "reject", // Action to reject a friend request.
  ViewProfile = "viewProfile", // Action to view a user's profile.
  ReadSummary = "readSummary", // Action to read a summary.
  ViewFlashcards = "viewFlashcards", // Action to view flashcards.
  Delete = "delete", // Action to delete a notification.
  Cancel = "cancel", // Action to cancel an operation.
  MarkAsRead = "markAsRead", // Action to mark a notification as read.
  MarkAsUnread = "markAsUnread", // Action to mark a notification as unread.
}

/**
 * Represents a list of notifications, including their associated summaries and authors.
 *
 * @typedef {Array<Object>} Notifications
 * @property {Tables<"notifications">} notifications - The notification details.
 * @property {Tables<"summaries"> & { authors: Tables<"authors"> }} summaries - The associated summaries with their authors.
 */
export type Notifications = (Tables<"notifications"> & {
  summaries: Tables<"summaries"> & {
    authors: Tables<"authors">;
  };
})[];
