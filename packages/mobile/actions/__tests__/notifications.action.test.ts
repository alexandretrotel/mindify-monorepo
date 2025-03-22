import { supabase } from "@/lib/supabase";
import {
  markNotificationAsRead,
  markNotificationAsUnread,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  deleteAllNotifications,
} from "@/actions/notifications.action";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
  },
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("Notifications actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("markNotificationAsRead", () => {
    it("should mark a notification as read", async () => {
      const notificationId = 1;

      (
        supabase.from("notifications").update({ is_read: true }).eq as jest.Mock
      ).mockResolvedValueOnce({ error: null });

      const result = await markNotificationAsRead(notificationId);

      expect(supabase.from).toHaveBeenCalledWith("notifications");
      expect(supabase.from("notifications").update).toHaveBeenCalledWith({ is_read: true });
      expect(supabase.from("notifications").update({ is_read: true }).eq).toHaveBeenCalledWith(
        "id",
        notificationId,
      );
      expect(result).toEqual({ success: true });
    });

    it("should throw an error if the notification can't be marked as read", async () => {
      const notificationId = 1;

      (
        supabase.from("notifications").update({ is_read: true }).eq as jest.Mock
      ).mockResolvedValueOnce({ error: "error" });

      await expect(markNotificationAsRead(notificationId)).rejects.toThrow(
        "Une erreur est survenue lors de la mise à jour de la notification",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("markNotificationAsUnread", () => {
    it("should mark a notification as unread", async () => {
      const notificationId = 1;

      (
        supabase.from("notifications").update({ is_read: false }).eq as jest.Mock
      ).mockResolvedValueOnce({ error: null });

      const result = await markNotificationAsUnread(notificationId);

      expect(supabase.from).toHaveBeenCalledWith("notifications");
      expect(supabase.from("notifications").update).toHaveBeenCalledWith({ is_read: false });
      expect(supabase.from("notifications").update({ is_read: false }).eq).toHaveBeenCalledWith(
        "id",
        notificationId,
      );
      expect(result).toEqual({ success: true });
    });

    it("should throw an error if the notification can't be marked as unread", async () => {
      const notificationId = 1;

      (
        supabase.from("notifications").update({ is_read: false }).eq as jest.Mock
      ).mockResolvedValueOnce({ error: "error" });

      await expect(markNotificationAsUnread(notificationId)).rejects.toThrow(
        "Une erreur est survenue lors de la mise à jour de la notification",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("deleteNotification", () => {
    it("should delete a notification", async () => {
      const notificationId = 1;

      (supabase.from("notifications").delete().eq as jest.Mock).mockResolvedValueOnce({
        error: null,
      });

      const result = await deleteNotification(notificationId);

      expect(supabase.from).toHaveBeenCalledWith("notifications");
      expect(supabase.from("notifications").delete).toHaveBeenCalledWith();
      expect(supabase.from("notifications").delete().eq).toHaveBeenCalledWith("id", notificationId);
      expect(result).toEqual({ success: true });
    });

    it("should throw an error if the notification can't be deleted", async () => {
      const notificationId = 1;
      const mockError = new Error("Failed to delete notification");

      (supabase.from("notifications").delete().eq as jest.Mock).mockResolvedValueOnce({
        error: mockError,
      });

      await expect(deleteNotification(notificationId)).rejects.toThrow(
        "Une erreur est survenue lors de la suppression de la notification",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getNotifications", () => {
    it("should get all notifications", async () => {
      const notifications = [
        {
          id: 1,
          title: "Notification 1",
        },
        {
          id: 2,
          title: "Notification 2",
        },
      ];

      (
        supabase
          .from("notifications")
          .select("*, summaries(id, title, slug, authors(name, slug), topics(name))")
          .order as jest.Mock
      ).mockResolvedValueOnce({
        data: notifications,
        error: null,
      });

      (
        supabase.from("summaries").select("*, authors(name, slug, description), topics(name, slug)")
          .in as jest.Mock
      ).mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const result = await getNotifications();

      expect(supabase.from).toHaveBeenCalledWith("notifications");
      expect(supabase.from("notifications").select).toHaveBeenCalledWith(
        "*, summaries(id, title, slug, authors(name, slug), topics(name))",
      );
      expect(supabase.from("notifications").select().order).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
      expect(result).toEqual(notifications);
    });

    it("should throw an error if the notifications can't be fetched", async () => {
      const mockError = new Error("Failed to fetch notifications");

      (
        supabase
          .from("notifications")
          .select("*, summaries(id, title, slug, authors(name, slug), topics(name))")
          .order as jest.Mock
      ).mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

      await expect(getNotifications()).rejects.toThrow(
        "Une erreur est survenue lors de la récupération des notifications",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("markAllNotificationsAsRead", () => {
    it("should mark all notifications as read for a user's ID", async () => {
      const userId = "1";

      (
        supabase.from("notifications").update({ is_read: true }).eq as jest.Mock
      ).mockResolvedValueOnce({ error: null });

      const result = await markAllNotificationsAsRead(userId);

      expect(supabase.from).toHaveBeenCalledWith("notifications");
      expect(supabase.from("notifications").update).toHaveBeenCalledWith({ is_read: true });
      expect(supabase.from("notifications").update({ is_read: true }).eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(result).toEqual({ success: true });
    });

    it("should throw an error if the notifications can't be marked as read", async () => {
      const userId = "1";

      (
        supabase.from("notifications").update({ is_read: true }).eq as jest.Mock
      ).mockResolvedValueOnce({ error: "error" });

      await expect(markAllNotificationsAsRead(userId)).rejects.toThrow(
        "Une erreur est survenue lors de la mise à jour des notifications",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("deleteAllNotifications", () => {
    it("should delete all notifications for a user's ID", async () => {
      const userId = "1";

      (supabase.from("notifications").delete().eq as jest.Mock).mockResolvedValueOnce({
        error: null,
      });

      const result = await deleteAllNotifications(userId);

      expect(supabase.from).toHaveBeenCalledWith("notifications");
      expect(supabase.from("notifications").delete).toHaveBeenCalledWith();
      expect(supabase.from("notifications").delete().eq).toHaveBeenCalledWith("user_id", userId);
      expect(result).toEqual({ success: true });
    });

    it("should throw an error if the notifications can't be deleted", async () => {
      const userId = "1";

      (supabase.from("notifications").delete().eq as jest.Mock).mockResolvedValueOnce({
        error: "error",
      });

      await expect(deleteAllNotifications(userId)).rejects.toThrow(
        "Une erreur est survenue lors de la mise à jour des notifications",
      );

      expect(console.error).toHaveBeenCalled();
    });
  });
});
