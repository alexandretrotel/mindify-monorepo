import { supabase } from "@/lib/supabase";

/**
 * Delete all messages from a chat
 *
 * @param userId The user ID
 * @param chatId The chat ID
 * @returns {Promise<{ success: boolean }>} The result of the operation
 */
export const deleteAllMessages = async (userId: string, chatId: number) => {
  const { error } = await supabase
    .from("mindify_ai_chats")
    .delete()
    .match({ user_id: userId, id: chatId });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la suppression des messages");
  }

  return { success: true };
};

/**
 * Fetch the chat ID for a user
 *
 * @param userId The user ID
 * @returns {Promise<{ id: number } | null>} The chat ID or null if not found
 */
export const fetchChatId = async (userId: string) => {
  const { data, error } = await supabase
    .from("mindify_ai_chats")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Create a new chat for a user
 *
 * @param userId The user ID
 * @returns {Promise<{ id: number }>} The new chat
 */
export const createChat = async (userId: string) => {
  const { data: newChat, error: createError } = await supabase
    .from("mindify_ai_chats")
    .insert({ user_id: userId })
    .select()
    .single();

  if (createError) {
    throw createError;
  }

  return newChat;
};

/**
 * Get the number of prompts for a user today
 *
 * @param userId The user ID
 * @returns {Promise<number>} The number of prompts
 */
export const getUserTodayPromptsCount = async (userId: string) => {
  try {
    const { data: chats, error: errorChats } = await supabase
      .from("mindify_ai_chats")
      .select("id")
      .eq("user_id", userId);

    if (errorChats) {
      throw errorChats;
    }

    if (!chats?.length) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("mindify_ai_messages")
      .select("created_at")
      .in(
        "chat_id",
        chats.map((chat) => chat.id),
      )
      .gte("created_at", today.toISOString());

    if (error) {
      throw error;
    }

    return data?.length || 0;
  } catch (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des messages");
  }
};
