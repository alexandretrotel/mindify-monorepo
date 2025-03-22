import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useSession } from "@/providers/SessionProvider";
import NotificationsProvider, { useNotifications } from "@/providers/NotificationsProvider";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  deleteAllNotifications,
} from "@/actions/notifications.action";

jest.mock("@/actions/notifications.action", () => ({
  getNotifications: jest.fn(),
  markNotificationAsRead: jest.fn(),
  deleteNotification: jest.fn(),
  markNotificationAsUnread: jest.fn(),
  markAllNotificationsAsRead: jest.fn(),
  deleteAllNotifications: jest.fn(),
}));

jest.mock("@/providers/SessionProvider", () => ({
  useSession: jest.fn(),
}));

jest.mock("@expo/react-native-action-sheet", () => ({
  useActionSheet: () => ({
    showActionSheetWithOptions: jest.fn(),
  }),
}));

jest.mock("posthog-react-native", () => ({
  usePostHog: jest.fn(() => ({
    optedOut: false,
    capture: jest.fn(),
  })),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      update: jest.fn(),
      delete: jest.fn(),
    })),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    })),
    removeChannel: jest.fn(),
  },
}));

describe("NotificationsProvider", () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ userId: 1 });
    (getNotifications as jest.Mock).mockResolvedValue([
      { id: 1, is_read: false, created_at: new Date() },
      { id: 2, is_read: false, created_at: new Date() },
    ]);
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("provides notifications data and loading state", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationsProvider>{children}</NotificationsProvider>
    );

    const { result } = renderHook(() => useNotifications(), { wrapper });

    await waitFor(() => {
      expect(result.current.areNotificationsLoading).toBe(false);
    });
    expect(result.current.notifications.length).toBe(2);
  });

  it("deletes a notification", async () => {
    (getNotifications as jest.Mock).mockResolvedValue([
      { id: 1, is_read: false, created_at: new Date("2023-01-01") },
      { id: 2, is_read: false, created_at: new Date("2022-02-01") },
    ]);
    (deleteNotification as jest.Mock).mockResolvedValue(undefined);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationsProvider>{children}</NotificationsProvider>
    );

    const { result } = renderHook(() => useNotifications(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.areNotificationsLoading).toBe(false);
    });

    result.current.deleteNotif(1);

    await waitFor(() => {
      expect(deleteNotification).toHaveBeenCalledWith(1);
    });
    expect(result.current.notifications.length).toBe(1);
    expect(result.current.notifications.find((n) => n.id === 1)).toBeUndefined();
  });

  it("handles errors in marking notification as read", async () => {
    (markNotificationAsRead as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationsProvider>{children}</NotificationsProvider>
    );

    const { result } = renderHook(() => useNotifications(), { wrapper });

    result.current.markAsReadNotif(1);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
    expect(Alert.alert).toHaveBeenCalledWith("Erreur", expect.any(String));
    expect(result.current.notifications[0].is_read).toBe(false);
  });

  it("fetches notifications and sorts them", async () => {
    (getNotifications as jest.Mock).mockResolvedValue([
      { id: 1, is_read: false, created_at: new Date("2023-01-01") },
      { id: 2, is_read: false, created_at: new Date("2023-02-01") },
    ]);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationsProvider>{children}</NotificationsProvider>
    );

    const { result } = renderHook(() => useNotifications(), { wrapper });

    await waitFor(() => {
      expect(result.current.notifications[0].id).toBe(2);
    });
    expect(result.current.notifications[1].id).toBe(1);
  });

  it("counts unread notifications", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationsProvider>{children}</NotificationsProvider>
    );

    const { result } = renderHook(() => useNotifications(), { wrapper });

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(2);
    });
  });

  it("marks notification as read and then as unread", async () => {
    (getNotifications as jest.Mock).mockResolvedValue([
      { id: 1, is_read: true, created_at: new Date("2023-01-01") },
      { id: 2, is_read: false, created_at: new Date("2023-02-01") },
    ]);
    (markNotificationAsRead as jest.Mock).mockResolvedValue(undefined);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationsProvider>{children}</NotificationsProvider>
    );

    const { result } = renderHook(() => useNotifications(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.areNotificationsLoading).toBe(false);
    });

    result.current.markAsReadNotif(1);

    await waitFor(() => {
      expect(markNotificationAsRead).toHaveBeenCalledWith(1);
    });
    expect(result.current.notifications.find((n) => n.id === 1)?.is_read).toBe(true);

    result.current.markAsUnreadNotif(1);

    await waitFor(() => {
      expect(markNotificationAsUnread).toHaveBeenCalledWith(1);
    });
    expect(result.current.notifications.find((n) => n.id === 1)?.is_read).toBe(false);
  });

  it("marks all notifications as read", async () => {
    (getNotifications as jest.Mock).mockResolvedValue([
      { id: 1, is_read: false, created_at: new Date("2023-01-01") },
      { id: 2, is_read: false, created_at: new Date("2023-02-01") },
    ]);
    (markNotificationAsRead as jest.Mock).mockResolvedValue(undefined);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationsProvider>{children}</NotificationsProvider>
    );

    const { result } = renderHook(() => useNotifications(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.areNotificationsLoading).toBe(false);
    });

    result.current.markAllNotifAsRead();

    await waitFor(() => {
      expect(markAllNotificationsAsRead).toHaveBeenCalledWith(1);
    });
    expect(result.current.notifications.every((n) => n.is_read)).toBe(true);
  });

  it("handles errors in marking all notifications as read", async () => {
    (markAllNotificationsAsRead as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationsProvider>{children}</NotificationsProvider>
    );

    const { result } = renderHook(() => useNotifications(), { wrapper });

    result.current.markAllNotifAsRead();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
    expect(Alert.alert).toHaveBeenCalledWith("Erreur", expect.any(String));
    expect(result.current.notifications.every((n) => !n.is_read)).toBe(true);
  });

  it("deletes all notifications", async () => {
    (getNotifications as jest.Mock).mockResolvedValue([
      { id: 1, is_read: false, created_at: new Date("2023-01-01") },
      { id: 2, is_read: false, created_at: new Date("2023-02-01") },
    ]);
    (deleteNotification as jest.Mock).mockResolvedValue(undefined);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationsProvider>{children}</NotificationsProvider>
    );

    const { result } = renderHook(() => useNotifications(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.areNotificationsLoading).toBe(false);
    });

    result.current.deleteAllNotifs();

    await waitFor(() => {
      expect(deleteAllNotifications).toHaveBeenCalledWith(1);
    });
    expect(result.current.notifications.length).toBe(0);
  });

  it("handles errors in deleting all notifications", async () => {
    (getNotifications as jest.Mock).mockResolvedValue([
      { id: 1, is_read: false, created_at: new Date("2023-01-01") },
      { id: 2, is_read: false, created_at: new Date("2023-02-01") },
    ]);
    (deleteAllNotifications as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NotificationsProvider>{children}</NotificationsProvider>
    );

    const { result } = renderHook(() => useNotifications(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.areNotificationsLoading).toBe(false);
    });

    result.current.deleteAllNotifs();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
    expect(Alert.alert).toHaveBeenCalledWith("Erreur", expect.any(String));
    expect(result.current.notifications.length).toBe(2);
  });
});
