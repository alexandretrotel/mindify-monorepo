import { model } from "@/lib/ai-model";
import { getAuthorPrompt } from "@/utils/prompts";
import { generateObject } from "ai";
import { z } from "zod";

export async function generateAuthor(author: string) {
  const authorPrompt = getAuthorPrompt(author);

  const authorResult = await generateObject({
    model,
    prompt: authorPrompt,
    schemaName: "AuthorSchema",
    schemaDescription:
      "Schema for generating author descriptions,don't use markdown at all, just plain text",
    schema: z.object({
      description: z.string(),
    }),
  });

  return {
    author,
    description: authorResult.object.description,
  };
}
