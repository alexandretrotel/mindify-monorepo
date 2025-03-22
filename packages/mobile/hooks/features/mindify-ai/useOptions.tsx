import { useActionSheet } from "@expo/react-native-action-sheet";
import { useCallback } from "react";
import { Alert } from "react-native";

type Message = {
  chat_id: number;
  sender: "user" | "AI";
  content: string;
  created_at: string;
  id: string;
};

export default function useOptions(
  userId: string | null,
  chatId: number | null,
  messages: Message[],
  setMessages: (messages: Message[]) => void,
  resetGeneralChatId: () => void,
) {
  const { showActionSheetWithOptions } = useActionSheet();

  const handleAlertDeleteDialog = useCallback(() => {
    Alert.alert("Mindify AI", "Êtes-vous sûr de vouloir supprimer tous les messages ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          if (!userId || !chatId) return;

          const oldMessages = messages;

          try {
            setMessages([]);
            await resetGeneralChatId();
          } catch (error) {
            setMessages(oldMessages);
            console.error(error);
          }
        },
      },
    ]);
  }, [chatId, messages, setMessages, userId, resetGeneralChatId]);

  const handleNotificationsActionSheet = useCallback(() => {
    showActionSheetWithOptions(
      {
        options: ["Supprimer tous les messages", "Annuler"],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          handleAlertDeleteDialog();
        }
      },
    );
  }, [handleAlertDeleteDialog, showActionSheetWithOptions]);

  return { handleAlertDeleteDialog, handleNotificationsActionSheet };
}
