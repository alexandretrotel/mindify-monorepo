import { useState, useEffect } from "react";
import OpenAI from "openai";
import type { Tables } from "@/types/supabase";
import { MINDIFY_AI_SUGGESTIONS_PROMPT } from "@/data/prompts";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

// TODO: use host instead of apiKey
const openai = new OpenAI({
  apiKey:
    "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",
  organization: "org-qzZNqzf526KURCZEdwNpkufb",
});

export const useDynamicSuggestions = (conversation: Tables<"mindify_ai_messages">[]) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateSuggestions = async () => {
      if (!conversation || conversation.length === 0) return;

      setLoading(true);

      try {
        const messages: Message[] = conversation.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        }));

        setSuggestions([]);

        const systemPromptMessage: Message = {
          role: "system",
          content: MINDIFY_AI_SUGGESTIONS_PROMPT,
        };
        const suggestionsMessagesWithSystemPrompt = [systemPromptMessage, ...messages];

        const completions = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: suggestionsMessagesWithSystemPrompt,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "suggestions_schema",
              schema: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        });

        if (completions.choices[0].message.content) {
          const object = JSON.parse(completions.choices[0].message.content) as {
            suggestions: string[];
          };
          const suggestions: string[] = Object.values(object)[0];
          setSuggestions(suggestions);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    generateSuggestions();
  }, [conversation]);

  return { suggestions, loading };
};
