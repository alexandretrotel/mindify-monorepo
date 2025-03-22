import { renderHook, waitFor } from "@testing-library/react-native";
import useChat from "@/hooks/features/mindify-ai/useChat";
import { supabase } from "@/lib/supabase";
import {
  createChat,
  deleteAllMessages,
  fetchChatId,
  getUserTodayPromptsCount,
} from "@/actions/mindify-ai-chats";
import { Alert } from "react-native";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  },
}));

jest.mock("@/actions/mindify-ai-chats", () => ({
  createChat: jest.fn(),
  deleteAllMessages: jest.fn(),
  fetchChatId: jest.fn(),
  getUserTodayPromptsCount: jest.fn(),
}));

describe("useChat", () => {
  const mockUserId = "test_user_id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should fetch existing chat ID", async () => {
    (fetchChatId as jest.Mock).mockResolvedValue({ id: 1 });

    const { result } = renderHook(() => useChat(mockUserId));

    await waitFor(() => {
      expect(result.current.chatId).toBe(1);
    });
  });

  it("should create a new chat if none exists", async () => {
    (fetchChatId as jest.Mock).mockResolvedValue(null);
    (createChat as jest.Mock).mockResolvedValue({ id: 2 });

    const { result } = renderHook(() => useChat(mockUserId));

    expect(result.current.chatId).toBe(null);

    await waitFor(() => {
      expect(result.current.chatId).toBe(2);
    });
  });

  it("should return null if mockUserId is null", async () => {
    const { result } = renderHook(() => useChat(null));

    expect(result.current.chatId).toBe(null);
  });

  it("should handle errors when fetching chat", async () => {
    (
      supabase.from("mindify_ai_chats").select("id").eq("user_id", mockUserId)
        .maybeSingle as jest.Mock
    ).mockResolvedValueOnce({
      data: null,
      error: new Error("Fetch error"),
    });

    const { result } = renderHook(() => useChat(mockUserId));

    await waitFor(() => {
      expect(result.current.chatId).toBe(null);
    });
  });

  it("should handle errors when creating chat", async () => {
    (
      supabase.from("mindify_ai_chats").select("id").eq("user_id", mockUserId)
        .maybeSingle as jest.Mock
    ).mockResolvedValueOnce({
      data: null,
      error: null,
    });

    (
      supabase.from("mindify_ai_chats").insert({ user_id: mockUserId }).select().single as jest.Mock
    ).mockResolvedValueOnce({
      data: null,
      error: new Error("Create error"),
    });

    const { result } = renderHook(() => useChat(mockUserId));

    await waitFor(() => {
      expect(result.current.chatId).toBe(null);
    });
  });

  describe("resetGeneralChatId", () => {
    const mockUserId = "test_user_id";
    const mockChatId = 1;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
      jest.spyOn(Alert, "alert").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should reset chat ID on successful deletion and creation", async () => {
      (fetchChatId as jest.Mock).mockResolvedValue({ id: 1 });
      (deleteAllMessages as jest.Mock).mockResolvedValue(undefined);
      (createChat as jest.Mock).mockResolvedValue({ id: 3 });

      const { result } = renderHook(() => useChat(mockUserId));

      await waitFor(() => {
        expect(result.current.chatId).toBe(1);
      });

      result.current.resetGeneralChatId();

      await waitFor(() => {
        expect(deleteAllMessages).toHaveBeenCalledWith(mockUserId, mockChatId);
      });
      expect(createChat).toHaveBeenCalledWith(mockUserId);

      expect(result.current.chatId).toBe(3);
    });

    it("should handle errors when deleting messages", async () => {
      (fetchChatId as jest.Mock).mockResolvedValue({ id: 1 });
      (deleteAllMessages as jest.Mock).mockRejectedValue(new Error("Delete error"));

      const { result } = renderHook(() => useChat(mockUserId));

      await waitFor(() => {
        expect(result.current.chatId).toBe(1);
      });

      result.current.resetGeneralChatId();

      await waitFor(() => {
        expect(deleteAllMessages).toHaveBeenCalledWith(mockUserId, mockChatId);
      });
      expect(console.error).toHaveBeenCalledWith(expect.any(Error));

      expect(Alert.alert).toHaveBeenCalledWith(
        "Erreur",
        "Une erreur est survenue lors de la récupération du chat.",
      );

      expect(result.current.chatId).toBe(1);
    });

    it("should handle errors when creating a new chat", async () => {
      (fetchChatId as jest.Mock).mockResolvedValue({ id: 1 });
      (deleteAllMessages as jest.Mock).mockResolvedValue(undefined);
      (createChat as jest.Mock).mockRejectedValue(new Error("Create chat error"));

      const { result } = renderHook(() => useChat(mockUserId));

      await waitFor(() => {
        expect(result.current.chatId).toBe(1);
      });

      result.current.resetGeneralChatId();

      await waitFor(() => {
        expect(deleteAllMessages).toHaveBeenCalledWith(mockUserId, mockChatId);
      });
      expect(createChat).toHaveBeenCalledWith(mockUserId);

      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erreur",
        "Une erreur est survenue lors de la récupération du chat.",
      );

      expect(result.current.chatId).toBe(1);
    });
  });

  describe("fetchNumberOfPrompts", () => {
    it("should fetch the number of prompts", async () => {
      (getUserTodayPromptsCount as jest.Mock).mockResolvedValue(3);

      const { result } = renderHook(() => useChat(mockUserId));

      await waitFor(() => {
        expect(result.current.numberOfPrompts).toBe(3);
      });

      expect(getUserTodayPromptsCount).toHaveBeenCalledWith(mockUserId);
      expect(result.current.numberOfPrompts).toBe(3);
      expect(result.current.loading).toBe(false);
    });

    it("should handle errors when fetching the number of prompts", async () => {
      (getUserTodayPromptsCount as jest.Mock).mockRejectedValue(new Error("Fetch error"));

      const { result } = renderHook(() => useChat(mockUserId));

      await waitFor(() => {
        expect(result.current.numberOfPrompts).toBe(0);
      });

      expect(getUserTodayPromptsCount).toHaveBeenCalledWith(mockUserId);
      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
      expect(Alert.alert).toHaveBeenCalledWith(
        "Erreur",
        "Une erreur est survenue lors de la récupération des prompts.",
      );
      expect(result.current.loading).toBe(false);
    });
  });

  describe("disable prompts when reaching the limit", () => {
    it("should disable prompts when reaching the limit", async () => {
      (getUserTodayPromptsCount as jest.Mock).mockResolvedValue(5);

      const { result } = renderHook(() => useChat(mockUserId));

      await waitFor(() => {
        expect(result.current.disabled).toBe(true);
      });

      expect(result.current.disabled).toBe(true);
    });

    it("should not disable prompts when not reaching the limit", async () => {
      (getUserTodayPromptsCount as jest.Mock).mockResolvedValue(4);

      const { result } = renderHook(() => useChat(mockUserId));

      await waitFor(() => {
        expect(result.current.disabled).toBe(false);
      });
    });
  });
});
