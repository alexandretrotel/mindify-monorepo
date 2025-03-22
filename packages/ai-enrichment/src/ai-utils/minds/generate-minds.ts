import { model } from "@/lib/ai-model";
import { getMindsPrompt } from "@/utils/prompts";
import { generateObject } from "ai";
import { z } from "zod";

export async function generateMinds(title: string, author: string) {
  const mindsPrompt = getMindsPrompt(title, author);

  const mindsResult = await generateObject({
    model,
    prompt: mindsPrompt,
    schemaName: "MindsSchema",
    schemaDescription:
      "Schema for generating minds based on the book, don't use markdown at all, just plain text",
    schema: z.object({
      array: z
        .object({
          minds: z.string(),
          questions: z.string(),
        })
        .array(),
    }),
  });

  return mindsResult.object.array;
}
