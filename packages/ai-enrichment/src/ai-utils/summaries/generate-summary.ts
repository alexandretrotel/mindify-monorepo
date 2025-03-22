import { model } from "@/lib/ai-model";
import { getSummaryPrompt } from "@/utils/prompts";
import { generateObject } from "ai";
import { z } from "zod";

export async function generateSummary(title: string, author: string) {
  const summaryPrompt = getSummaryPrompt(title, author);

  const summaryResult = await generateObject({
    model,
    prompt: summaryPrompt,
    schemaName: "SummarySchema",
    schemaDescription:
      "Schema for generating book summaries, don't use markdown at all, just plain text",
    schema: z.object({
      readingTime: z.number(),
      chapters: z
        .object({
          title: z.string(),
          text: z.string(),
        })
        .array(),
    }),
  });

  return {
    chapters: summaryResult?.object?.chapters,
    readingTime: summaryResult?.object?.readingTime,
  };
}
