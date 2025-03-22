"use server";

import { supabase } from "@/lib/supabase";
import { getSummariesFromIds } from "./summaries.action";

/**
 * Mark a notification as read
 *
 * @param notificationId
 * @returns {Promise<{ success: boolean }>}
 */
export async function markNotificationAsRead(notificationId: number) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la mise à jour de la notification");
  }

  return { success: true };
}

/**
 * Mark a notification as unread
 *
 * @param notificationId
 * @returns {Promise<{ success: boolean }>}
 */
export async function markNotificationAsUnread(notificationId: number) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: false })
    .eq("id", notificationId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la mise à jour de la notification");
  }

  return { success: true };
}

/**
 * Delete a notification
 *
 * @param notificationId
 * @returns {Promise<{ success: boolean }>}
 */
export async function deleteNotification(notificationId: number) {
  const { error } = await supabase.from("notifications").delete().eq("id", notificationId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la suppression de la notification");
  }

  return { success: true };
}

/**
 * Get all notifications
 *
 * @throws {Error} - Throws an error if the operation fails.
 * @returns {Promise<(Tables<'notifications'> & { summaries: Tables<'summaries'> & { authors: Tables<'authors'>; topics: Tables<'topics'>; }; })[]>} - A promise that resolves to the notifications.
 */
export async function getNotifications() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des notifications");
  }

  const summaryIds = data
    ?.map((notification) => {
      if (!notification?.data) {
        return null;
      }

      return JSON.parse(JSON.stringify(notification?.data)).summary_id as number;
    })
    .filter((summaryId) => summaryId !== null);

  const summaries = await getSummariesFromIds(summaryIds);

  const notifications = data
    ?.map((notification) => {
      if (!notification?.data) {
        return {
          ...notification,
        };
      }

      const summaryId = JSON.parse(JSON.stringify(notification?.data)).summary_id as number;

      return {
        ...notification,
        summaries: {
          ...summaries.find((summary) => summary.id === summaryId),
        },
      };
    })
    ?.filter((notification) => notification !== null);

  return notifications;
}

/**
 * Mark all notifications as read
 *
 * @param userId
 * @throws {Error} - Throws an error if the operation fails.
 * @returns {Promise<boolean>} - A promise that resolves to true if the notifications are marked as read.
 */
export async function markAllNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la mise à jour des notifications");
  }

  return { success: true };
}

/**
 * Delete all notifications
 *
 * @param userId
 * @throws {Error} - Throws an error if the operation fails.
 * @returns {Promise<boolean>} - A promise that resolves to true if the notifications are deleted.
 */
export async function deleteAllNotifications(userId: string) {
  const { error } = await supabase.from("notifications").delete().eq("user_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la mise à jour des notifications");
  }

  return { success: true };
}
