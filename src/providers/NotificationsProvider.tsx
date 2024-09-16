"use client";
import "client-only";

import React from "react";
import type { Tables } from "@/types/supabase";
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
  markNotificationAsUnread
} from "@/actions/notifications.action";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import type { UUID } from "crypto";
import { getUserId } from "@/actions/users.action";

export const NotificationContext = React.createContext({
  notifications: [] as (Tables<"notifications"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
    };
  })[],
  setNotifications: (
    notifications: (Tables<"notifications"> & {
      summaries: Tables<"summaries"> & {
        authors: Tables<"authors">;
      };
    })[]
  ) => {},
  areNotificationsLoading: true,
  setAreNotificationsLoading: (isLoading: boolean) => {},
  markAsReadNotif: async (notificationId: number) => {},
  markAsUnreadNotif: async (notificationId: number) => {},
  deleteNotif: async (notificationId: number) => {},
  markAllNotifAsRead: async () => {}
});

export default function NotificationsProvider({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [notifications, setNotifications] = React.useState<
    (Tables<"notifications"> & {
      summaries: Tables<"summaries"> & {
        authors: Tables<"authors">;
      };
    })[]
  >([]);
  const [areNotificationsLoading, setAreNotificationsLoading] = React.useState(true);
  const [userId, setUserId] = React.useState<UUID | undefined>(undefined);

  const { toast } = useToast();

  React.useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserId();
      setUserId(userId);
    };

    fetchUserId();
  }, []);

  React.useEffect(() => {
    const fetchNotifications = async () => {
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
        console.error("Une erreur est survenue lors de la récupération des notifications");
        throw new Error("Une erreur est survenue lors de la récupération des notifications");
      } finally {
        setAreNotificationsLoading(false);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  React.useEffect(() => {
    const supabase = createClient();

    const notificationsChanges = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications"
        },
        (payload) => {
          const newNotification = payload.new as Tables<"notifications"> & {
            summaries: Tables<"summaries"> & {
              authors: Tables<"authors">;
            };
          };

          const orderedNotifications = [newNotification, ...notifications]?.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });

          setNotifications(orderedNotifications);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChanges);
    };
  }, [notifications]);

  const markAsReadNotif = React.useCallback(
    async (notificationId: number) => {
      try {
        await markNotificationAsRead(notificationId);
        setNotifications((notifications) =>
          notifications.map((notification) => {
            if (notification.id === notificationId) {
              return { ...notification, is_read: true };
            }

            return notification;
          })
        );
      } catch (error) {
        setNotifications((notifications) =>
          notifications.map((notification) => {
            if (notification.id === notificationId) {
              return { ...notification, is_read: false };
            }

            return notification;
          })
        );
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la mise à jour de la notification",
          variant: "destructive"
        });
      }
    },
    [toast]
  );

  const markAsUnreadNotif = React.useCallback(
    async (notificationId: number) => {
      try {
        await markNotificationAsUnread(notificationId);
        setNotifications((notifications) =>
          notifications.map((notification) => {
            if (notification.id === notificationId) {
              return { ...notification, is_read: false };
            }

            return notification;
          })
        );
      } catch (error) {
        setNotifications((notifications) =>
          notifications.map((notification) => {
            if (notification.id === notificationId) {
              return { ...notification, is_read: true };
            }

            return notification;
          })
        );
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la mise à jour de la notification",
          variant: "destructive"
        });
      }
    },
    [toast]
  );

  const deleteNotif = React.useCallback(
    async (notificationId: number) => {
      try {
        await deleteNotification(notificationId);
        setNotifications((notifications) =>
          notifications.filter((notification) => notification.id !== notificationId)
        );
      } catch (error) {
        setNotifications((notifications) =>
          notifications.map((notification) => {
            if (notification.id === notificationId) {
              return { ...notification, is_archived: false };
            }

            return notification;
          })
        );
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression de la notification",
          variant: "destructive"
        });
      }
    },
    [toast]
  );

  const markAllNotifAsRead = React.useCallback(async () => {
    try {
      markAllNotifAsRead();

      setNotifications((notifications) =>
        notifications.map((notification) => {
          return { ...notification, is_read: true };
        })
      );
    } catch (error) {
      setNotifications((notifications) =>
        notifications.map((notification) => {
          return { ...notification, is_read: false };
        })
      );
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des notifications",
        variant: "destructive"
      });
    }
  }, [toast]);

  const value = React.useMemo(
    () => ({
      notifications,
      setNotifications,
      areNotificationsLoading,
      setAreNotificationsLoading,
      markAsReadNotif,
      deleteNotif,
      markAsUnreadNotif,
      markAllNotifAsRead
    }),
    [
      notifications,
      areNotificationsLoading,
      markAsReadNotif,
      deleteNotif,
      markAsUnreadNotif,
      markAllNotifAsRead
    ]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
