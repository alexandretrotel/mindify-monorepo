import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!
});

const model = google("gemini-1.5-flash-latest");

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401
    });
  }

  try {
    await suggestSummaries();
    return new Response("Summary suggestion done", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error while fetching summaries", { status: 500 });
  }
}

async function suggestSummaries() {
  const supabaseAdmin = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data, error } = await supabaseAdmin
      .from("summaries")
      .select("title, authors(name), topics(id, name)");

    if (error) {
      return new Response("Error while fetching summaries", { status: 500 });
    }

    const prompt = `Trouve 10 résumés de livres non fictifs, similaires mais différents de ceux-ci, en indiquant le titre et l'auteur en français: 
- Titres: ${data.map((summary) => summary.title).join(", ")} 
- Auteurs respectifs: ${data.map((summary) => summary?.authors?.name).join(", ")}. 
Les sujets des livres doivent être en rapport avec ces couples id/nom: 
- IDs: ${data.map((summary) => summary?.topics?.id).join(", ")}
- Noms: ${data.map((summary) => summary?.topics?.name).join(", ")}.`;

    const suggestionsResult = await generateObject({
      model,
      prompt,
      schemaName: "SuggestionSchema",
      schemaDescription: "Schema for generating summary suggestions",
      schema: z
        .object({
          title: z.string(),
          author: z.string(),
          topic: z.number()
        })
        .array()
    });

    suggestionsResult?.object.forEach(async (suggestion) => {
      const { data: suggestionDataCheck, error: suggestionErrorCheck } = await supabaseAdmin
        .from("summary_requests")
        .select("*")
        .eq("title", suggestion.title)
        .eq("author", suggestion.author)
        .maybeSingle();

      if (suggestionErrorCheck) {
        throw new Error("Error while checking suggestion");
      }

      if (suggestionDataCheck) {
        console.log("Suggestion already exists in the database", suggestionDataCheck);
        return;
      }

      const { error: suggestionsError } = await supabaseAdmin.from("summary_requests").insert({
        title: suggestion.title,
        author: suggestion.author,
        topic_id: suggestion.topic,
        validated: false,
        source: "book" // TODO: change later
      });

      if (suggestionsError) {
        throw new Error("Error while inserting suggestion");
      }
    });

    return new Response("Summary suggestion done", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error while fetching summaries", { status: 500 });
  }
}
