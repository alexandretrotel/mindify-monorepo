import { streamObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { MINDIFY_AI_SUGGESTIONS_PROMPT } from "@/data/prompts";
import { suggestionsSchema } from "@/schema/mindify-ai.schema";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!
});
const model = google("gemini-1.5-flash-latest");

export const maxDuration = 30;

export async function POST(req: Request) {
  const prompt = await req.json();

  if (typeof prompt !== "string") {
    return new Response("Invalid request", { status: 400 });
  }

  const result = await streamObject({
    model,
    system: MINDIFY_AI_SUGGESTIONS_PROMPT,
    prompt,
    schema: suggestionsSchema
  });

  return result.toTextStreamResponse();
}
