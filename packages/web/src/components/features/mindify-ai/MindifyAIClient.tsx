"use client";
import "client-only";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import H3 from "@/components/typography/h3";
import Messages from "@/components/features/mindify-ai/Messages";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { experimental_useObject as useObject } from "ai/react";
import { motion } from "framer-motion";
import useMindifyChat from "@/hooks/features/mindify-ai/useChat";
import ChatPopover from "@/components/features/mindify-ai/ChatPopover";
import Suggestions from "@/components/features/mindify-ai/Suggestions";
import useLoadOldMessages from "@/hooks/features/mindify-ai/useLoadOldMessages";
import { suggestionsSchema } from "@/schema/mindify-ai.schema";

export default function MindifyAIClient({ userId }: { userId: string }) {
  const { chatId, resetGeneralChatId } = useMindifyChat(userId);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    error,
    setInput,
    append
  } = useChat({
    api: "/api/v1/mindify-ai",
    body: {
      chatId
    }
  });
  useLoadOldMessages(chatId, setMessages);
  const { object, submit } = useObject({
    api: "/api/v1/mindify-ai/suggestions",
    schema: suggestionsSchema
  });
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Une erreur est survenue",
        description:
          "Une erreur est survenue lors de la communication avec le serveur, veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [error]);

  return (
    <div className="stretch mx-auto flex w-full max-w-3xl flex-col py-12">
      <div className="flex w-full justify-between gap-4">
        <H3 className="mb-4 text-center">Mindify AI</H3>
        <ChatPopover
          chatId={chatId}
          messages={messages}
          setMessages={setMessages}
          resetGeneralChatId={resetGeneralChatId}
        />
      </div>

      <div className="stretch flex w-full flex-col gap-8">
        <Messages messages={messages} />

        <div className="flex w-full flex-col gap-4">
          {object?.suggestions && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: input ? 0 : 1, y: input ? 20 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Suggestions
                setInput={setInput}
                append={append}
                submit={submit}
                suggestions={object?.suggestions?.filter((suggestion) => suggestion !== undefined)}
              />
            </motion.div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (!input) return;

              handleSubmit();
              submit(input);
            }}
            className="flex w-full gap-4"
          >
            <Input
              value={input}
              placeholder="Qu'est ce que je peux apprendre sur Mindify?"
              onChange={handleInputChange}
            />
            <Button disabled={isLoading || !input} type="submit">
              {isLoading ? (
                <Loader2Icon className="h-5 w-5 animate-spin text-primary-foreground" />
              ) : (
                "Envoyer"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
