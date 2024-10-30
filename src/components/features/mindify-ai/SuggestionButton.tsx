import Span from "@/components/typography/span";
import { type Message } from "ai";
import React from "react";
import { v4 as uuidv4 } from "uuid";

interface SuggestionButtonProps {
  suggestion: string;
  onSubmit: (content: string) => void;
}

const SuggestionButton: React.FC<SuggestionButtonProps> = ({ suggestion, onSubmit }) => {
  const handleClick = () => {
    const message: Message = {
      id: uuidv4(),
      role: "user",
      content: suggestion
    };
    onSubmit(suggestion);
  };

  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-md bg-muted p-2 py-4 hover:bg-muted/80"
      onClick={handleClick}
    >
      <Span size="xs">{suggestion}</Span>
    </button>
  );
};

export default SuggestionButton;
