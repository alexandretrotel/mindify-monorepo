"use server";
import "server-only";

import type { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";

export async function markNotificationAsRead(notificationId: number) {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la mise à jour de la notification");
  }
}

export async function markNotificationAsUnread(notificationId: number) {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: false })
    .eq("id", notificationId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la mise à jour de la notification");
  }
}

export async function deleteNotification(notificationId: number) {
  const supabase = createClient();

  const { error } = await supabase.from("notifications").delete().eq("id", notificationId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la suppression de la notification");
  }
}

export async function getNotifications() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*, summaries(title, slug, authors(name, slug), topics(name))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des notifications");
  }

  const notifications = data as (Tables<"notifications"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  })[];

  return notifications;
}

export async function markAllNotificationsAsRead(userId: UUID) {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la mise à jour des notifications");
  }
}
