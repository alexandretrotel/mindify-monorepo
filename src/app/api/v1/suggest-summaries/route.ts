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

  const supabaseURL = process.env.SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  try {
    const response = await suggestSummaries(supabaseURL, supabaseServiceRoleKey);

    if (!response) {
      return new Response("Summary suggestion done", { status: 200 });
    }

    return response;
  } catch (error) {
    console.error(error);
    return new Response("Error while fetching summaries", { status: 500 });
  }
}

async function suggestSummaries(supabaseURL: string, supabaseServiceRoleKey: string) {
  const supabaseAdmin = createClient<Database>(supabaseURL, supabaseServiceRoleKey);

  try {
    const { data: topicsData, error: topicsError } = await supabaseAdmin.from("topics").select("*");

    if (topicsError) {
      throw new Error("Error while fetching topics");
    }

    const prompt = `Trouve 20 livres plutôt non fictifs, similaires mais différents de ceux-ci, en indiquant le titre et l'auteur en français ainsi que l'intérêt du livre.
    
    Chaque intérêt porte un nom et un identifiant. Voici les intérêts possibles :
    ${topicsData?.map((topic) => `${topic.id}: ${topic.name}`).join("\n")}

    Tu ne dois alors renvoyer que :
    - le titre du livre
    - l'auteur du livre
    - l'intérêt du livre (en utilisant l'identifiant de l'intérêt)
    `;

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

    for (const suggestion of suggestionsResult.object) {
      try {
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
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    return new Response("Summary suggestion done", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error while fetching summaries", { status: 500 });
  }
}
