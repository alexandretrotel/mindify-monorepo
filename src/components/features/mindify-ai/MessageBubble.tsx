import ThemedMarkdown from "@/components/typography/ThemedMarkdown";

export default function MessageBubble({ role, content }: { role: string; content: string }) {
  if (role === "user") {
    return (
      <div className="my-4 w-fit self-end rounded-lg bg-muted p-2 px-3 text-foreground">
        {content}
      </div>
    );
  }

  return (
    <div className="my-4 whitespace-pre-wrap">
      <ThemedMarkdown>{content}</ThemedMarkdown>
    </div>
  );
}
