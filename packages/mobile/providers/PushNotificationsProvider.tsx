import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/utils/push-notifications";
import { saveTokenForUser } from "@/actions/push-notifications.action";
import { useSession } from "@/providers/SessionProvider";

const PushNotificationsContext = createContext<{
  expoPushToken: string | undefined;
  notification: Notifications.Notification | undefined;
}>({
  expoPushToken: undefined,
  notification: undefined,
});

export default function PushNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined,
  );

  const { userId } = useSession();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    Notifications.setBadgeCountAsync(0);
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const saveToken = async () => {
      if (!userId || !expoPushToken) {
        return;
      }

      try {
        await saveTokenForUser(userId, expoPushToken);
      } catch (error) {
        console.error(error);
      }
    };

    if (expoPushToken && userId) {
      saveToken();
    }
  }, [expoPushToken, userId]);

  const value = useMemo(() => ({ expoPushToken, notification }), [expoPushToken, notification]);

  return (
    <PushNotificationsContext.Provider value={value}>{children}</PushNotificationsContext.Provider>
  );
}

export function usePushNotifications() {
  const context = useContext(PushNotificationsContext);

  if (!context) {
    throw new Error("usePushNotifications must be used within a PushNotificationsProvider");
  }

  return context;
}
