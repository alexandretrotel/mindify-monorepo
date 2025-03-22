import { deleteAllMessages, getUserTodayPromptsCount } from "@/actions/mindify-ai-chats";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
  },
}));

describe("Mindify AI Actions", () => {
  const userId = "user123";
  const chatId = 456;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("deleteAllMessages", () => {
    it("should delete all messages successfully", async () => {
      (supabase.from("mindify_ai_chats").delete().match as jest.Mock).mockResolvedValueOnce({
        error: null,
      });

      const result = await deleteAllMessages(userId, chatId);

      expect(supabase.from("mindify_ai_chats").delete().match).toHaveBeenCalledWith({
        user_id: userId,
        id: chatId,
      });
      expect(result).toEqual({ success: true });
    });

    it("should throw an error when deletion fails", async () => {
      const errorMessage = "Database error";
      (supabase.from("mindify_ai_chats").delete().match as jest.Mock).mockResolvedValueOnce({
        error: new Error(errorMessage),
      });

      await expect(deleteAllMessages(userId, chatId)).rejects.toThrow(
        "Une erreur est survenue lors de la suppression des messages",
      );

      expect(supabase.from("mindify_ai_chats").delete().match).toHaveBeenCalledWith({
        user_id: userId,
        id: chatId,
      });
    });
  });

  describe("getUserTodayPromptsCount", () => {
    it("should return the count of prompts for today", async () => {
      const userId = "user123";
      const mockChats = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const count = 5;

      (supabase.from("mindify_ai_chats").select("id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockChats,
        error: null,
      });
      (
        supabase
          .from("mindify_ai_messages")
          .select("created_at")
          .in(
            "chat_id",
            mockChats.map((chat) => chat.id),
          ).gte as jest.Mock
      ).mockResolvedValueOnce({
        data: Array.from({ length: count }).map(() => ({
          user_id: userId,
          created_at: new Date(),
        })),
        error: null,
      });

      const result = await getUserTodayPromptsCount(userId);

      expect(
        supabase.from("mindify_ai_chats").select("user_id, created_at").eq("user_id", userId).gte,
      ).toHaveBeenCalledWith("created_at", expect.any(String));
      expect(result).toBe(count);
    });

    it("should return 0 if there are no prompts for today", async () => {
      const userId = "user123";
      const mockChats = [{ id: 1 }, { id: 2 }, { id: 3 }];

      (supabase.from("mindify_ai_chats").select("id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockChats,
        error: null,
      });
      (
        supabase
          .from("mindify_ai_messages")
          .select("created_at")
          .in(
            "chat_id",
            mockChats.map((chat) => chat.id),
          ).gte as jest.Mock
      ).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const result = await getUserTodayPromptsCount(userId);

      expect(
        supabase.from("mindify_ai_chats").select("user_id, created_at").eq("user_id", userId).gte,
      ).toHaveBeenCalledWith("created_at", expect.any(String));
      expect(result).toBe(0);
    });

    it("should return 0 if no chats are found", async () => {
      const userId = "user123";
      const mockChats: any[] = [];

      (supabase.from("mindify_ai_chats").select("id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockChats,
        error: null,
      });

      const result = await getUserTodayPromptsCount(userId);

      expect(supabase.from("mindify_ai_chats").select("id").eq).toHaveBeenCalledWith(
        "user_id",
        userId,
      );
      expect(result).toBe(0);
    });

    it("should throw an error if the chats query fails", async () => {
      const userId = "user123";
      const mockError = new Error("Database error");

      (supabase.from("mindify_ai_chats").select("id").eq as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

      await expect(getUserTodayPromptsCount(userId)).rejects.toThrow(
        "Une erreur est survenue lors de la récupération des messages",
      );

      expect(
        supabase.from("mindify_ai_chats").select("user_id, created_at").eq,
      ).toHaveBeenCalledWith("user_id", userId);
      expect(console.error).toHaveBeenCalledWith(mockError);
    });

    it("should throw an error if the messages query fails", async () => {
      const userId = "user123";
      const mockChats = [{ id: 1 }, { id: 2 }, { id: 3 }];

      (supabase.from("mindify_ai_chats").select("id").eq as jest.Mock).mockResolvedValueOnce({
        data: mockChats,
        error: null,
      });
      (
        supabase
          .from("mindify_ai_messages")
          .select("created_at")
          .in(
            "chat_id",
            mockChats.map((chat) => chat.id),
          ).gte as jest.Mock
      ).mockResolvedValueOnce({
        data: null,
        error: new Error("Database error"),
      });

      await expect(getUserTodayPromptsCount(userId)).rejects.toThrow(
        "Une erreur est survenue lors de la récupération des messages",
      );

      expect(
        supabase.from("mindify_ai_chats").select("user_id, created_at").eq,
      ).toHaveBeenCalledWith("user_id", userId);
      expect(
        supabase.from("mindify_ai_chats").select("user_id, created_at").eq("user_id", userId).gte,
      ).toHaveBeenCalledWith("created_at", expect.any(String));
      expect(console.error).toHaveBeenCalled();
    });
  });
});
