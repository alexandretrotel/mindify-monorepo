import {
  sendPushNotification,
  registerForPushNotificationsAsync,
} from "@/utils/push-notifications";
import * as Notifications from "expo-notifications";
import type { Tables } from "@/types/supabase";

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: {
    MAX: "max",
  },
}));

jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: "test-project-id",
      },
    },
  },
  easConfig: {
    projectId: "test-project-id",
  },
}));

jest.mock("expo-device", () => ({
  isDevice: true,
}));

jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
  Alert: {
    alert: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe("push-notifications", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("sendPushNotification", () => {
    it("should send a push notification with the correct payload", async () => {
      const expoPushToken = "test-token";
      const notification: Tables<"notifications"> = {
        id: 1,
        title: "Test Title",
        message: "Test Message",
        friend_id: null,
        type: "friend_request",
        summary_id: null,
        is_read: false,
        mind_id: null,
        user_id: "test-user-id",
        updated_at: "2024-01-01T00:00:00.000Z",
        created_at: "2024-01-01T00:00:00.000Z",
      };

      await sendPushNotification(expoPushToken, notification);

      expect(global.fetch).toHaveBeenCalledWith("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: expoPushToken,
          sound: "default",
          title: notification.title,
          body: notification.message,
          data: { data: notification },
        }),
      });
    });
  });

  describe("registerForPushNotificationsAsync", () => {
    it("should register for push notifications and return the push token", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "undetermined",
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
        data: "test-push-token",
      });

      const pushToken = await registerForPushNotificationsAsync();

      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalledWith({
        projectId: "test-project-id",
      });
      expect(pushToken).toBe("test-push-token");
    });
  });
});
