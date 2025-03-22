import { Message } from "ai";
import MessageBubble from "@/components/features/mindify-ai/MessageBubble";
import Span from "@/components/typography/span";

export default function Messages({ messages }: { messages: Message[] }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Span>Aucun message pour le moment, posez une question pour commencer.</Span>
      </div>
    );
  }

  return (
    <>
      {messages.map((m) => (
        <MessageBubble key={m.id} role={m.role} content={m.content} />
      ))}
    </>
  );
}
