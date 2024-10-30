import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { MINDIFY_AI_SYSTEM_PROMPT } from "@/data/prompts";
import { createClient } from "@/utils/supabase/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!
});
const model = google("gemini-1.5-flash-latest");

export const maxDuration = 30;

const saveUserChat = async (text: string, chatId: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("mindify_ai_messages").insert({
    chat_id: chatId,
    content: text,
    sender: "user"
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to save user chat");
  }

  return data;
};

const saveAIChat = async (text: string, chatId: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("mindify_ai_messages").insert({
    chat_id: chatId,
    content: text,
    sender: "AI"
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to save AI chat");
  }

  return data;
};

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();

    const result = await streamText({
      model,
      system: MINDIFY_AI_SYSTEM_PROMPT,
      messages: messages,
      async onFinish({ text }) {
        try {
          await saveUserChat(messages?.reverse()?.[0]?.content, chatId);
          await saveAIChat(text, chatId);
        } catch (error) {
          console.error(error);
          throw new Error("Failed to save AI chat");
        }
      }
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("An error occurred", { status: 500 });
  }
}
