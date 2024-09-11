"use client";
import "client-only";

import React from "react";
import type { Tables } from "@/types/supabase";
import {
  archiveNotification,
  deleteNotification,
  getDueFlashcardsNotifications,
  getNotifications,
  markNotificationAsRead
} from "@/actions/notifications.action";
import { useToast } from "@/components/ui/use-toast";

export const NotificationContext = React.createContext({
  notifications: [] as Tables<"notifications">[],
  setNotifications: (notifications: Tables<"notifications">[]) => {},
  areNotificationsLoading: true,
  setAreNotificationsLoading: (isLoading: boolean) => {}
});

export default function NotificationsProvider({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [notifications, setNotifications] = React.useState<Tables<"notifications">[]>([]);
  const [areNotificationsLoading, setAreNotificationsLoading] = React.useState(true);

  const { toast } = useToast();

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

    fetchNotifications();
  }, []);

  React.useEffect(() => {
    const fetchDueFlashcardsNotifications = async () => {
      const flashcardsNotifications = await getDueFlashcardsNotifications();

      if (flashcardsNotifications?.length === 0) {
        return;
      }

      const finalNotifications = [...notifications, ...flashcardsNotifications];
      const filteredNotifications = finalNotifications.filter(
        (notification, index, self) =>
          index === self.findIndex((t) => t.id === notification.id && t.type === notification.type)
      );

      const orderedNotifications = [...filteredNotifications]?.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setNotifications(orderedNotifications);
    };

    const interval = setInterval(() => {
      fetchDueFlashcardsNotifications();
    }, 300000); // 5 minutes

    fetchDueFlashcardsNotifications();

    return () => clearInterval(interval);
  }, [notifications]);

  const markAsReadNotif = React.useCallback(
    async (notificationId: number) => {
      try {
        await markNotificationAsRead(notificationId);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la mise à jour de la notification",
          variant: "destructive"
        });
      }
    },
    [toast]
  );

  const archiveNotif = React.useCallback(
    async (notificationId: number) => {
      try {
        await archiveNotification(notificationId);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'archivage de la notification",
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
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression de la notification",
          variant: "destructive"
        });
      }
    },
    [toast]
  );

  const value = React.useMemo(
    () => ({
      notifications,
      setNotifications,
      areNotificationsLoading,
      setAreNotificationsLoading,
      markAsReadNotif,
      archiveNotif,
      deleteNotif
    }),
    [notifications, areNotificationsLoading, markAsReadNotif, archiveNotif, deleteNotif]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
