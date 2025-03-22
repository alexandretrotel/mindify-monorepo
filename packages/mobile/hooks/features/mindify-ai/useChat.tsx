import {
  createChat,
  deleteAllMessages,
  fetchChatId,
  getUserTodayPromptsCount,
} from "@/actions/mindify-ai-chats";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

const promptLimit: number = 5;

export default function useChat(userId: string | null) {
  const [chatId, setChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [numberOfPrompts, setNumberOfPrompts] = useState(0);

  const numberOfPromptsLeft: number = useMemo(
    () => promptLimit - numberOfPrompts,
    [numberOfPrompts],
  );

  useEffect(() => {
    const fetchOrCreateChatId = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        const data = await fetchChatId(userId);

        if (data) {
          setChatId(data.id);
        } else {
          const newChat = await createChat(userId);
          setChatId(newChat.id);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Une erreur est survenue lors de la récupération du chat.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateChatId();
  }, [userId]);

  useEffect(() => {
    if (!chatId) return;

    const fetchNumberOfPrompts = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        const data = await getUserTodayPromptsCount(userId);

        setNumberOfPrompts(data);
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Une erreur est survenue lors de la récupération des prompts.");
      } finally {
        setLoading(false);
      }
    };

    fetchNumberOfPrompts();
  }, [chatId, userId]);

  useEffect(() => {
    const disabled = numberOfPrompts >= promptLimit;

    if (disabled) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [numberOfPrompts]);

  const resetGeneralChatId = useCallback(async () => {
    if (!userId || !chatId) return;

    setLoading(true);

    try {
      await deleteAllMessages(userId, chatId);

      const newChat = await createChat(userId);
      setChatId(newChat.id);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la récupération du chat.");
    } finally {
      setLoading(false);
    }
  }, [chatId, userId]);

  return {
    chatId,
    resetGeneralChatId,
    setChatId,
    numberOfPrompts,
    loading,
    disabled,
    numberOfPromptsLeft,
  };
}
