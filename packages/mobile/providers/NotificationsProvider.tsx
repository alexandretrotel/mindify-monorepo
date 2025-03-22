import React, { createContext, useCallback, useEffect, useState } from "react";
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  deleteAllNotifications,
} from "@/actions/notifications.action";
import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";
import { useSession } from "@/providers/SessionProvider";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { usePostHog } from "posthog-react-native";

type Notification = {
  summaries: {
    authors: {
      name: string;
      slug: string;
    };
    topics: {
      name: string;
    };
    id: number;
    title: string;
    slug: string;
  };
  created_at: string;
  friend_id: string | null;
  id: number;
  is_read: boolean;
  message: string;
  type: string;
  title: string;
  updated_at: string | null;
  summary_id: number | null;
  mind_id: number | null;
  user_id: string;
};

interface NotificationContextInterface {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  areNotificationsLoading: boolean;
  setAreNotificationsLoading: (isLoading: boolean) => void;
  markAsReadNotif: (notificationId: number) => Promise<void>;
  markAsUnreadNotif: (notificationId: number) => Promise<void>;
  deleteNotif: (notificationId: number) => Promise<void>;
  markAllNotifAsRead: () => Promise<void>;
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  handleRefresh: (setRefreshing: React.Dispatch<React.SetStateAction<boolean>>) => Promise<void>;
  handleNotificationsActionSheet: () => void;
  deleteAllNotifs: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextInterface>({
  notifications: [],
  setNotifications: (notifications) => {},
  areNotificationsLoading: true,
  setAreNotificationsLoading: (isLoading: boolean) => {},
  markAsReadNotif: async (notificationId: number) => {},
  markAsUnreadNotif: async (notificationId: number) => {},
  deleteNotif: async (notificationId: number) => {},
  markAllNotifAsRead: async () => {},
  unreadCount: 0,
  fetchNotifications: async () => {},
  handleRefresh: async (setRefreshing: React.Dispatch<React.SetStateAction<boolean>>) => {},
  handleNotificationsActionSheet: () => {},
  deleteAllNotifs: async () => {},
});

export default function NotificationsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [areNotificationsLoading, setAreNotificationsLoading] = useState(true);

  const { userId } = useSession();
  const { showActionSheetWithOptions } = useActionSheet();
  const posthog = usePostHog();

  const fetchNotifications = useCallback(async () => {
    setAreNotificationsLoading(true);

    try {
      const notifications = await getNotifications();

      if (notifications?.length === 0) {
        return;
      }

      const orderedNotifications = [...notifications]?.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setNotifications(orderedNotifications);
    } catch (error) {
      console.error(error);
      throw new Error("Une erreur est survenue lors de la récupération des notifications");
    } finally {
      setAreNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [fetchNotifications, userId]);

  useEffect(() => {
    const notificationsChanges = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newNotification = payload.new as Notification;

          const orderedNotifications = [newNotification, ...notifications]?.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });

          setNotifications(orderedNotifications);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChanges);
    };
  }, [notifications]);

  const markAsReadNotif = useCallback(async (notificationId: number) => {
    try {
      setNotifications((notifications) =>
        notifications.map((notification) => {
          if (notification.id === notificationId) {
            return { ...notification, is_read: true };
          }

          return notification;
        }),
      );
      await markNotificationAsRead(notificationId);
    } catch (error) {
      setNotifications((notifications) =>
        notifications.map((notification) => {
          if (notification.id === notificationId) {
            return { ...notification, is_read: false };
          }

          return notification;
        }),
      );
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour de la notification");
    }
  }, []);

  const markAsUnreadNotif = useCallback(async (notificationId: number) => {
    try {
      setNotifications((notifications) =>
        notifications.map((notification) => {
          if (notification.id === notificationId) {
            return { ...notification, is_read: false };
          }

          return notification;
        }),
      );
      await markNotificationAsUnread(notificationId);
    } catch (error) {
      setNotifications((notifications) =>
        notifications.map((notification) => {
          if (notification.id === notificationId) {
            return { ...notification, is_read: true };
          }

          return notification;
        }),
      );
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour de la notification");
    }
  }, []);

  const deleteNotif = useCallback(async (notificationId: number) => {
    try {
      setNotifications((notifications) =>
        notifications.filter((notification) => notification.id !== notificationId),
      );
      await deleteNotification(notificationId);
    } catch (error) {
      setNotifications((notifications) =>
        notifications.map((notification) => {
          if (notification.id === notificationId) {
            return { ...notification, is_archived: false };
          }

          return notification;
        }),
      );
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la suppression de la notification");
    }
  }, []);

  const markAllNotifAsRead = React.useCallback(async () => {
    if (!userId) return;

    try {
      setNotifications((notifications) =>
        notifications.map((notification) => {
          return { ...notification, is_read: true };
        }),
      );

      await markAllNotificationsAsRead(userId);
    } catch (error) {
      setNotifications((notifications) =>
        notifications.map((notification) => {
          return { ...notification, is_read: false };
        }),
      );
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour des notifications");
    }
  }, [userId]);

  const deleteAllNotifs = useCallback(async () => {
    if (!userId) return;

    try {
      setNotifications([]);

      await deleteAllNotifications(userId);
    } catch (error) {
      setNotifications(
        notifications.map((notification) => {
          return { ...notification };
        }),
      );
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour des notifications");
    }
  }, [notifications, userId]);

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  const handleRefresh = useCallback(
    async (setRefreshing: React.Dispatch<React.SetStateAction<boolean>>) => {
      setRefreshing(true);

      try {
        await fetchNotifications();
      } catch (error) {
        console.error("Failed to refresh notifications", error);
        Alert.alert("Erreur", "Une erreur est survenue lors de l'actualisation des notifications.");
      } finally {
        setRefreshing(false);
      }
    },
    [fetchNotifications],
  );

  const handleNotificationsActionSheet = useCallback(() => {
    const options = ["Marquer tout comme lu", "Tout supprimer", "Annuler"];
    const allReadButtonIndex = 0;
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      async (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case allReadButtonIndex:
            try {
              await markAllNotifAsRead();

              if (posthog.optedOut === false) {
                posthog.capture("user_marked_all_notifications_as_read");
              }
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la mise à jour des notifications",
              );
            } finally {
              break;
            }

          case destructiveButtonIndex:
            Alert.alert(
              "Confirmation",
              "Tu es sûr de vouloir supprimer toutes les notifications ?",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Supprimer",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await deleteAllNotifs();

                      if (posthog.optedOut === false) {
                        posthog.capture("user_deleted_all_notifications");
                      }
                    } catch (error) {
                      console.error(error);
                      Alert.alert(
                        "Erreur",
                        "Une erreur est survenue lors de la suppression des notifications",
                      );
                    }
                  },
                },
              ],
            );
            break;

          case cancelButtonIndex:
            break;
        }
      },
    );
  }, [deleteAllNotifs, markAllNotifAsRead, posthog, showActionSheetWithOptions]);

  const value = React.useMemo(
    () => ({
      notifications,
      setNotifications,
      areNotificationsLoading,
      setAreNotificationsLoading,
      markAsReadNotif,
      deleteNotif,
      markAsUnreadNotif,
      markAllNotifAsRead,
      unreadCount,
      fetchNotifications,
      handleRefresh,
      handleNotificationsActionSheet,
      deleteAllNotifs,
    }),
    [
      notifications,
      areNotificationsLoading,
      markAsReadNotif,
      deleteNotif,
      markAsUnreadNotif,
      markAllNotifAsRead,
      unreadCount,
      fetchNotifications,
      handleRefresh,
      handleNotificationsActionSheet,
      deleteAllNotifs,
    ],
  );

  if (!userId) {
    return <>{children}</>;
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }

  return context;
};
