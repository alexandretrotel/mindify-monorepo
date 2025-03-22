import Semibold from "@/components/typography/semibold";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Message } from "ai";
import { EllipsisIcon, TrashIcon } from "lucide-react";
import React from "react";

export default function ChatPopover({
  chatId,
  messages,
  setMessages,
  resetGeneralChatId
}: {
  chatId: number | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  resetGeneralChatId: () => Promise<void>;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <EllipsisIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col gap-4">
        <Semibold>Options</Semibold>

        <div className="flex w-full flex-col gap-2">
          <Button
            className="flex w-full items-center justify-start gap-2 px-2"
            variant="ghost"
            onClick={async () => {
              if (!chatId) return;

              const old = messages;

              try {
                setMessages([]);
                await resetGeneralChatId();
              } catch (error) {
                setMessages(old);
                console.error(error);
              }
            }}
          >
            <TrashIcon className="h-4 w-4" />
            Effacer la conversation
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
