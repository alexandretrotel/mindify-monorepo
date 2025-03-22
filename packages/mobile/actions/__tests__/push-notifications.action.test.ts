import { saveTokenForUser } from "@/actions/push-notifications.action";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn(),
  },
}));

describe("Push Notifications Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("saveTokenForUser", () => {
    const mockUserId = "user-id";
    const mockExpoPushToken = "expo-push-token";

    it("should save the token successfully", async () => {
      (supabase.from("push_notification_tokens").insert as jest.Mock).mockResolvedValue({
        error: null,
      });

      const result = await saveTokenForUser(mockUserId, mockExpoPushToken);

      expect(supabase.from).toHaveBeenCalledWith("push_notification_tokens");
      expect(supabase.from("push_notification_tokens").insert).toHaveBeenCalledWith({
        user_id: mockUserId,
        expo_push_token: mockExpoPushToken,
      });
      expect(result).toEqual({ success: true });
    });

    it("should handle errors during token saving", async () => {
      const mockError = new Error("Test error");
      (supabase.from("push_notification_tokens").insert as jest.Mock).mockResolvedValue({
        error: mockError,
      });

      await expect(saveTokenForUser(mockUserId, mockExpoPushToken)).rejects.toThrow(
        "Une erreur s'est produite lors de l'enregistrement du token pour les notifications push",
      );

      expect(supabase.from).toHaveBeenCalledWith("push_notification_tokens");
      expect(supabase.from("push_notification_tokens").insert).toHaveBeenCalledWith({
        user_id: mockUserId,
        expo_push_token: mockExpoPushToken,
      });
      expect(console.error).toHaveBeenCalledWith(mockError);
    });
  });
});
