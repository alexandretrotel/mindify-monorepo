import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";
import { Alert, Keyboard } from "react-native";
import uuid from "react-native-uuid";
import OpenAI from "openai";
import { MINDIFY_AI_SYSTEM_PROMPT } from "@/data/prompts";
import { ChatCompletionMessageParam } from "openai/resources";

type Message = {
  chat_id: number;
  sender: "user" | "AI";
  content: string;
  created_at: string;
  id: string;
};

// TODO: use host instead of apiKey
const openai = new OpenAI({
  apiKey:
    "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",
  organization: "org-qzZNqzf526KURCZEdwNpkufb",
});

export const useChatMessages = (chatId: number | null) => {
  const [messages, setMessages] = useState<Tables<"mindify_ai_messages">[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [AIloading, setAILoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;

    setRefreshing(true);

    try {
      const { data, error } = await supabase
        .from("mindify_ai_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      setLoading(true);
      fetchMessages();
      setLoading(false);
    }
  }, [chatId, fetchMessages]);

  const sendMessage = useCallback(
    async (content: string, sender: "user" | "AI") => {
      if (!chatId) return;

      const oldMessages = messages;
      const newMessage = {
        chat_id: chatId,
        sender,
        content,
        created_at: new Date().toISOString(),
        id: uuid.v4().toString(),
      };

      try {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        const { error } = await supabase
          .from("mindify_ai_messages")
          .insert({ chat_id: chatId, sender, content });

        if (error) {
          throw error;
        }
      } catch (error) {
        setMessages(oldMessages);
        console.error(error);
        Alert.alert("Erreur lors de l'envoi du message");
      }
    },
    [chatId, messages],
  );

  const sendToAI = useCallback(
    async (userMessage: string) => {
      if (!chatId) return;

      setAILoading(true);

      const formatMessages: ChatCompletionMessageParam[] = messages.map((message) => ({
        role: message.sender === "AI" ? "assistant" : "user",
        content: message.content,
      }));

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          stream: false,
          messages: [
            {
              role: "system",
              content: MINDIFY_AI_SYSTEM_PROMPT,
            },
            ...formatMessages,
            {
              role: "user",
              content: userMessage,
            },
          ],
        });

        if (completion.choices[0].message.content) {
          const newMessage: Message = {
            chat_id: chatId,
            sender: "AI",
            content: completion.choices[0].message.content,
            created_at: new Date().toISOString(),
            id: uuid.v4().toString(),
          };

          setMessages((prev) => [...prev, newMessage]);

          const { error } = await supabase
            .from("mindify_ai_messages")
            .insert({ chat_id: chatId, sender: "AI", content: newMessage.content });

          if (error) {
            throw error;
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setAILoading(false);
      }
    },
    [chatId, messages],
  );

  const handleSendMessage = useCallback(
    async (inputMessage: string) => {
      if (inputMessage.trim() === "") return;

      const oldInputMessage = inputMessage;

      try {
        setInputMessage("");
        Keyboard.dismiss();

        await sendMessage(inputMessage, "user");

        await sendToAI(inputMessage);
      } catch (error) {
        setInputMessage(oldInputMessage);
        console.error(error);
      }
    },
    [sendMessage, sendToAI],
  );

  return {
    messages,
    sendMessage,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    refreshing,
    setRefreshing,
    fetchMessages,
    loading,
    AIloading,
    setMessages,
  };
};
