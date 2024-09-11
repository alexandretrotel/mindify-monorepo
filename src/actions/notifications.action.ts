"use server";
import { createClient } from "@/utils/supabase/server";
import "server-only";

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

export async function deleteNotification(notificationId: number) {
  const supabase = createClient();

  const { error } = await supabase.from("notifications").delete().eq("id", notificationId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la suppression de la notification");
  }
}

export async function archiveNotification(notificationId: number) {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_archived: true })
    .eq("id", notificationId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de l'archivage de la notification");
  }
}

export async function getNotifications() {
  const supabase = createClient();

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des notifications");
  }

  return notifications;
}
