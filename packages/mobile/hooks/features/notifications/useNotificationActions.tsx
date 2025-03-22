import { acceptFriendRequest, rejectFriendRequest } from "@/actions/friends.action";
import { useNotifications } from "@/providers/NotificationsProvider";
import { useSession } from "@/providers/SessionProvider";
import { NotificationActionType } from "@/types/notifications";
import type { Tables } from "@/types/supabase";
import { getActionSheetOptions } from "@/utils/notifications";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { usePostHog } from "posthog-react-native";

/**
 * A hook that handles the notification actions.
 *
 * @param notification The notification.
 * @param swipeableRef The swipeable ref.
 * @param setIsNotificationOpen The function to set the notification open state.
 * @returns The show action sheet function, the mark as read function, the mark as unread function, the delete function, and the handle action function.
 */
const useNotificationActions = (notification: Tables<"notifications">) => {
  const { userId } = useSession();
  const router = useRouter();
  const posthog = usePostHog();
  const { showActionSheetWithOptions } = useActionSheet();
  const { markAsReadNotif, markAsUnreadNotif, deleteNotif } = useNotifications();

  const handleAction = async (actionType: NotificationActionType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      switch (actionType) {
        case NotificationActionType.Accept:
          await acceptFriendRequest(userId as string, notification.friend_id!);
          break;
        case NotificationActionType.Reject:
          await rejectFriendRequest(userId as string, notification.friend_id!);
          break;
        default:
          return;
      }
      deleteNotif(notification.id);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", `Une erreur est survenue.`);
    }
  };

  const showActionSheet = async () => {
    const options = getActionSheetOptions(notification);

    const markAsReadUnreadOption = notification.is_read
      ? { label: "Marquer comme non lu", type: NotificationActionType.MarkAsUnread }
      : { label: "Marquer comme lu", type: NotificationActionType.MarkAsRead };

    const updatedOptions = [
      ...options.filter((opt) => opt.type !== NotificationActionType.Delete),
      markAsReadUnreadOption,
      ...options.filter((opt) => opt.type === NotificationActionType.Delete),
    ];

    showActionSheetWithOptions(
      {
        options: updatedOptions.map((opt) => opt.label),
        cancelButtonIndex: updatedOptions.findIndex(
          (opt) => opt.type === NotificationActionType.Cancel,
        ),
        destructiveButtonIndex: updatedOptions.findIndex(
          (opt) => opt.type === NotificationActionType.Delete,
        ),
      },

      async (buttonIndex) => {
        const selectedOption = updatedOptions[buttonIndex as number];
        if (!selectedOption) return;

        switch (selectedOption.type) {
          case NotificationActionType.ViewProfile:
            await markAsReadNotif(notification.id);

            if (posthog.optedOut === false) {
              posthog.capture("user_opened_profile_from_notifications", {
                profile_id: notification.friend_id,
              });
            }

            router.replace(`/profile/${notification.friend_id}`);
            break;
          case NotificationActionType.ReadSummary:
            await markAsReadNotif(notification.id);

            if (posthog.optedOut === false) {
              posthog.capture("user_opened_summary_from_notifications", {
                summary_id: notification.summary_id,
              });
            }

            router.push(`/summary/preview/${notification.summary_id}`);
            break;
          case NotificationActionType.ViewFlashcards:
            await markAsReadNotif(notification.id);

            if (posthog.optedOut === false) {
              posthog.capture("user_opened_flashcards_from_notifications", {
                summary_id: notification.summary_id,
              });
            }

            router.replace("/learn");
            break;
          case NotificationActionType.Delete:
            await deleteNotif(notification.id);

            if (posthog.optedOut === false) {
              posthog.capture("user_deleted_notification", {
                notification_id: notification.id,
              });
            }

            break;
          case NotificationActionType.MarkAsRead:
            await markAsReadNotif(notification.id);
            break;
          case NotificationActionType.MarkAsUnread:
            await markAsUnreadNotif(notification.id);
            break;
          default:
            await handleAction(selectedOption.type);
            break;
        }
      },
    );
  };

  return { showActionSheet, markAsReadNotif, markAsUnreadNotif, deleteNotif, handleAction };
};

export default useNotificationActions;
