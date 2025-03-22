import { renderHook, waitFor } from "@testing-library/react-native";
import { useChatMessages } from "@/hooks/features/mindify-ai/useChatMessages";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    channel: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
    unsuscribe: jest.fn().mockReturnThis(),
  },
}));

describe("useChatMessages", () => {
  const mockChatId = 1;
  const mockSendToAI = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("initial state", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("fetches initial messages on mount", async () => {
      const mockMessages = [{ id: 1, chat_id: mockChatId, content: "Hello" }];

      (
        supabase.from("mindify_ai_messages").select("*").eq("chat_id", mockChatId)
          .order as jest.Mock
      ).mockResolvedValue({ data: mockMessages, error: null });

      const { result } = renderHook(() => useChatMessages(mockChatId));

      await waitFor(() => {
        expect(result.current.messages).toEqual(mockMessages);
      });
    });

    it("handle error when fetching messages", async () => {
      const mockError = new Error("Error fetching messages");

      (
        supabase.from("mindify_ai_messages").select("*").eq("chat_id", mockChatId)
          .order as jest.Mock
      ).mockResolvedValue({
        error: mockError,
      });

      const { result } = renderHook(() => useChatMessages(mockChatId));

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(mockError);
      });
      expect(result.current.messages).toEqual([]);
    });
  });

  describe("send message", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("sends message and clears input", async () => {
      const mockUserMessage = "User message";
      const mockAIResponse = "AI response";

      mockSendToAI.mockResolvedValue(mockAIResponse);

      (supabase.from("mindify_ai_messages").insert as jest.Mock).mockResolvedValue({ error: null });

      const { result } = renderHook(() => useChatMessages(mockChatId));

      result.current.setInputMessage(mockUserMessage);
      result.current.handleSendMessage(mockUserMessage);

      expect(supabase.from).toHaveBeenCalledWith("mindify_ai_messages");
      await waitFor(() => expect(result.current.inputMessage).toBe(""));
    });
  });
});
