import SuggestionButton from "@/components/features/mindify-ai/SuggestionButton";
import { type ChatRequestOptions, type CreateMessage, type Message } from "ai";
import { v4 } from "uuid";

export default function Suggestions({
  suggestions,
  setInput,
  append,
  submit
}: {
  suggestions: string[];
  setInput: (value: string) => void;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  submit: (content: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 overflow-hidden overflow-x-auto md:grid-cols-4">
      {suggestions?.map(
        (suggestion, index) =>
          suggestion && (
            <SuggestionButton
              key={index}
              suggestion={suggestion}
              onSubmit={(content) => {
                setInput(content);
                setTimeout(async () => {
                  append({ id: v4(), role: "user", content });
                  submit(content);
                }, 100);
                setInput("");
              }}
            />
          )
      )}
    </div>
  );
}
