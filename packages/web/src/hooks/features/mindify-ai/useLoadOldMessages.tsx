import { getMessages } from "@/actions/mindify-ai.action";
import { useToast } from "@/components/ui/use-toast";
import { type Message } from "ai";
import React, { useEffect, useState } from "react";

export default function useLoadOldMessages(
  chatId: number | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  const [oldMessages, setOldMessages] = useState<Message[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchOldMessages = async () => {
      if (!chatId) return;

      try {
        const messages = await getMessages(chatId);

        setOldMessages(messages);
        setMessages(messages);
      } catch (error) {
        console.error(error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération des anciens messages.",
          variant: "destructive"
        });
      }
    };

    fetchOldMessages();
  }, [chatId]);

  return {
    oldMessages
  };
}
