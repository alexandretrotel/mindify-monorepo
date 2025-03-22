import { createOpenAI } from "@ai-sdk/openai";
import dotenv from "dotenv";

dotenv.config();

const ai = createOpenAI({
  apiKey: process.env.AI_KEY!,
  compatibility: "strict",
});

export const model = ai("gpt-4o-mini");
