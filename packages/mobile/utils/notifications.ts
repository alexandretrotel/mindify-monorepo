import { NotificationActionType, Notifications, NotificationType } from "@/types/notifications";
import { Tables } from "@/types/supabase";
import { parseISO, differenceInDays } from "date-fns";

/**
 * Categorizes notifications into Today, This Week, This Month, and Earlier.
 * @param {Array<Tables<"notifications"> & {summaries: Tables<"summaries"> & { authors: Tables<"authors"> }}>} notifications - List of notifications to categorize.
 * @returns {Array<{title: string, data: Notifications}>} - Categorized notifications based on the time period.
 */
export const categorizeNotifications = (
  notifications: (Tables<"notifications"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
    };
  })[],
) => {
  const today: Notifications = [];
  const thisWeek: Notifications = [];
  const thisMonth: Notifications = [];
  const earlier: Notifications = [];

  notifications?.forEach((notification) => {
    const date = parseISO(notification.created_at);
    const daysDifference = differenceInDays(new Date(), date);

    if (daysDifference === 0) {
      today.push(notification);
    } else if (daysDifference <= 7) {
      thisWeek.push(notification);
    } else if (daysDifference <= 30) {
      thisMonth.push(notification);
    } else {
      earlier.push(notification);
    }
  });

  const result = [
    { title: "Aujourd'hui", data: today },
    { title: "Cette semaine", data: thisWeek },
    { title: "Ce mois", data: thisMonth },
    { title: "Plus tôt", data: earlier },
  ];

  return result.filter((category) => category.data.length > 0) ?? [];
};

/**
 * Generates an action sheet based on the notification type.
 * @param {Tables<"notifications">} notification - The notification object containing type and other details.
 * @returns {Array<{label: string, type: NotificationActionType}>} - List of action options available for the notification.
 */
export const getActionSheetOptions = (notification: Tables<"notifications">) => {
  const options = [
    notification.type.includes("friend") && {
      label: "Voir le profil",
      type: NotificationActionType.ViewProfile,
    },
    notification.type === NotificationType.FriendRequest && {
      label: "Accepter la demande",
      type: NotificationActionType.Accept,
    },
    notification.type === NotificationType.FriendRequest && {
      label: "Refuser la demande",
      type: NotificationActionType.Reject,
    },
    notification.type.includes(NotificationType.Summary) && {
      label: "Lire le résumé",
      type: NotificationActionType.ReadSummary,
    },
    notification.type === NotificationType.FlashcardsDue && {
      label: "Voir les flashcards",
      type: NotificationActionType.ViewFlashcards,
    },
    { label: "Supprimer", type: NotificationActionType.Delete },
    { label: "Annuler", type: NotificationActionType.Cancel },
  ]?.filter((option) => option !== false);

  return options;
};
