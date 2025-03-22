import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import * as Notifications from "expo-notifications";
import PushNotificationsProvider, {
  usePushNotifications,
} from "@/providers/PushNotificationsProvider";
import { registerForPushNotificationsAsync } from "@/utils/push-notifications";
import { saveTokenForUser } from "@/actions/push-notifications.action";
import { useSession } from "@/providers/SessionProvider";

jest.mock("@/utils/push-notifications", () => ({
  registerForPushNotificationsAsync: jest.fn(),
}));

jest.mock("@/actions/push-notifications.action", () => ({
  saveTokenForUser: jest.fn(),
}));

jest.mock("@/providers/SessionProvider", () => ({
  useSession: jest.fn(),
}));

jest.mock("expo-notifications", () => ({
  setBadgeCountAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  removeNotificationSubscription: jest.fn(),
}));

describe("PushNotificationsProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    (useSession as jest.Mock).mockReturnValue({ userId: 1 });
    (registerForPushNotificationsAsync as jest.Mock).mockResolvedValue("test-token");
    (Notifications.addNotificationReceivedListener as jest.Mock).mockImplementation((callback) => ({
      remove: Notifications.removeNotificationSubscription,
    }));
    (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockImplementation(
      (callback) => ({
        remove: Notifications.removeNotificationSubscription,
      }),
    );
  });

  it("registers for push notifications and sets the token", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PushNotificationsProvider>{children}</PushNotificationsProvider>
    );

    const { result } = renderHook(() => usePushNotifications(), { wrapper });

    await waitFor(() => {
      expect(registerForPushNotificationsAsync).toHaveBeenCalled();
    });
    expect(result.current.expoPushToken).toBe("test-token");
  });

  it("adds and removes notification listeners", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PushNotificationsProvider>{children}</PushNotificationsProvider>
    );

    const { unmount } = renderHook(() => usePushNotifications(), { wrapper });

    expect(Notifications.addNotificationReceivedListener).toHaveBeenCalled();
    expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalled();

    unmount();

    expect(Notifications.removeNotificationSubscription).toHaveBeenCalledTimes(2);
  });

  it("resets badge count on mount", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PushNotificationsProvider>{children}</PushNotificationsProvider>
    );

    renderHook(() => usePushNotifications(), { wrapper });

    expect(Notifications.setBadgeCountAsync).toHaveBeenCalledWith(0);
  });

  it("saves token for user when token and userId are available", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PushNotificationsProvider>{children}</PushNotificationsProvider>
    );

    renderHook(() => usePushNotifications(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(saveTokenForUser).toHaveBeenCalledWith(1, "test-token");
  });

  it("does not save token if userId is missing", async () => {
    (useSession as jest.Mock).mockReturnValue({ userId: undefined });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PushNotificationsProvider>{children}</PushNotificationsProvider>
    );

    renderHook(() => usePushNotifications(), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(saveTokenForUser).not.toHaveBeenCalled();
  });
});
