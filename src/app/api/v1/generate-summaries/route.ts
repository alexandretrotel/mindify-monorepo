import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { toSlug } from "@/utils/string";
import type { NextRequest } from "next/server";
import type { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!
});

const model = google("gemini-1.5-flash-latest");

// TODO: support prompts other summaries than books
const getAuthorPrompt = (authorName: string): string => {
  const prompt = `Résume en français de manière concise la biographie de ${authorName} sans faire allusion à un livre en particulier. Renvoie également un slug qui correspond au nom de l'auteur.`;

  return prompt;
};

const getSummaryPrompt = (title: string, authorName: string): string => {
  const prompt = `
Mission : Résumer le concept et les leçons de "${title}" de ${authorName} en 5 à 8 chapitres captivants en français.

Pour chaque chapitre :

1. Choisis un sous-titre accrocheur, formé d'une seule phrase exprimant une action ou une émotion (évite d'utiliser le signe “:” pour ne pas casser le rythme).  
2. Essaye de raconter le chapitre sous forme d'une histoire afin de vulgariser.
3. Utilise du storytelling et des exemples concrets pour simplifier et vulgariser les concepts abordés au sein des chapitres plutôt que de faire du contenu théorique.   
5. Assure-toi d'avoir autant de sous-titres que de chapitres (de 5 à 8 chapitres au total).  
6. Rends le texte dynamique, engageant et facile à lire, environ 200 mots par chapitre.

Détails supplémentaires :

- La longueur totale du texte doit avoisiner les 2000 mots (+/- 200 mots).  
- Fournis également une estimation du temps de lecture global.
- Ne mets pas de liens externes dans le texte ni de caractères spéciaux (comme des emojis, des guillemets, des retours à la ligne, etc.).
- Évite les retours à la ligne car cela provoque des erreurs de parsing ([Symbol(vercel.ai.error.AI_JSONParseError)]: true).
- La sortie n'est pas en markdown, donc ne mets pas de balises markdown dans le texte.

Objectif : Offrir une expérience de lecture immersive et instructive, en capturant l’essence de "${title}" tout en facilitant la compréhension des concepts pour un public large.
    `;

  return prompt;
};

const getMindsPrompt = (title: string, authorName: string): string => {
  const prompt = `
Un MIND est une idée extraite d’un média assez courte et concise sous la forme d'une citation (entre 200 et 500 caractères). Il s’agit plus précisément du résumé d’une notion ou d’un concept clé du média source. Ainsi, les utilisateurs peuvent lire des MINDS, les sauvegarder dans leur librairie et les garder en mémoire pour les réviser. Les utilisateurs premium seuls auront accès à cette fonctionnalité de révision qui se fera sous forme de flashcards. Il est écrit du point de vue de l'auteur.

Pour chaque MIND, écrit une question qui invite à la réflexion et à la discussion. Cette question doit être pertinente et en lien avec le MIND puisqu’elle servira de base pour la création des flashcards. Enfaite, la question doit pouvoir servir dans le cadre d'une flashcard donc on doit pouvoir y répondre en se basant sur le MIND. Par exemple, si le MIND est "La vie est un long fleuve tranquille", la question pourrait être "Quelle est la métaphore utilisée pour décrire la vie dans (titre du livre) ?".

Écrit entre 6 et 10 minds en français sur le livre ${title} de ${authorName} mais ne donne que le texte du mind et la question associée. Pas besoin de redonner le nom de l'auteur ou le titre du livre et ne formatte pas le texte comme une citation.
    `;

  return prompt;
};

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
    const response = await generateSummaries(supabaseURL, supabaseServiceRoleKey);

    if (!response) {
      return new Response("Summary generation done", { status: 200 });
    }

    return response;
  } catch (error) {
    console.error(error);
    return new Response("Error while fetching summaries", { status: 500 });
  }
}

async function generateSummaries(supabaseURL: string, supabaseServiceRoleKey: string) {
  const supabaseAdmin = createClient<Database>(supabaseURL, supabaseServiceRoleKey);

  try {
    console.log("Fetching summary requests...");
    const { data, error } = await supabaseAdmin
      .from("summary_requests")
      .select("*")
      .eq("validated", true);

    if (error) {
      throw new Error("Error while fetching summary requests");
    }

    if (!data || data.length === 0) {
      console.log("No summary requests found.");
      return new Response("No summary request to generate", { status: 200 });
    }

    for (const summaryRequest of data) {
      console.log("Generating summary for request", summaryRequest);

      try {
        console.log("Checking if author exists:", summaryRequest.author);
        const { data: authorDataCheck, error: authorErrorCheck } = await supabaseAdmin
          .from("authors")
          .select("*")
          .eq("name", summaryRequest.author)
          .maybeSingle();

        if (authorErrorCheck) {
          throw new Error("Error while checking author");
        }

        let authorDataGlobal;
        if (!authorDataCheck) {
          console.log("Author not found, generating author data...");
          const authorPrompt = getAuthorPrompt(summaryRequest.author);

          const authorResult = await generateObject({
            model,
            prompt: authorPrompt,
            schemaName: "AuthorSchema",
            schemaDescription: "Schema for generating author descriptions",
            schema: z.object({
              description: z.string()
            })
          });

          const authorSlug = toSlug(summaryRequest.author);
          console.log("Inserting new author data:", authorSlug);

          const { data: authorData, error: authorError } = await supabaseAdmin
            .from("authors")
            .insert({
              name: summaryRequest.author,
              slug: authorSlug,
              description: authorResult?.object?.description,
              mindify_ai: true
            })
            .select()
            .maybeSingle();

          if (authorError) {
            throw new Error("Error while inserting author");
          }

          authorDataGlobal = authorData;
        } else {
          console.log("Author found:", authorDataCheck);
          authorDataGlobal = authorDataCheck;
        }

        console.log("Checking if summary exists:", summaryRequest.title);
        const { data: summaryDataCheck, error: summaryErrorCheck } = await supabaseAdmin
          .from("summaries")
          .select("*")
          .eq("title", summaryRequest.title)
          .maybeSingle();

        if (summaryErrorCheck) {
          throw new Error("Error while checking summary");
        }

        let summaryDataGlobal;
        if (!summaryDataCheck) {
          console.log("Summary not found, generating summary data...");
          const summaryPrompt = getSummaryPrompt(summaryRequest.title, summaryRequest.author);

          const summaryResult = await generateObject({
            model,
            prompt: summaryPrompt,
            schemaName: "SummarySchema",
            schemaDescription: "Schema for generating book summaries",
            schema: z.object({
              readingTime: z.number(),
              chaptersTitle: z.string().array(),
              chaptersText: z.string().array()
            })
          });

          console.log("Inserting chapters data...");
          const { data: chaptersData, error: chaptersError } = await supabaseAdmin
            .from("chapters")
            .insert({
              titles: summaryResult?.object?.chaptersTitle,
              texts: summaryResult?.object?.chaptersText,
              mindify_ai: true
            })
            .select()
            .maybeSingle();

          if (chaptersError) {
            console.error("Error while inserting chapters", chaptersError);
            throw new Error("Error while inserting chapters");
          }

          const summaryTitleSlug = toSlug(summaryRequest.title);
          console.log("Inserting new summary data:", summaryTitleSlug);

          const { data: summaryData, error: summaryError } = await supabaseAdmin
            .from("summaries")
            .insert({
              title: summaryRequest.title,
              slug: summaryTitleSlug,
              topic_id: summaryRequest.topic_id,
              author_id: authorDataGlobal?.id as number,
              chapters_id: chaptersData?.id,
              source_type: summaryRequest.source,
              reading_time: summaryResult?.object?.readingTime,
              mindify_ai: true
            })
            .select()
            .maybeSingle();

          if (summaryError) {
            throw new Error("Error while inserting summary");
          }

          summaryDataGlobal = summaryData;
        } else {
          console.log("Summary found:", summaryDataCheck);
          summaryDataGlobal = summaryDataCheck;
        }

        console.log("Generating minds for summary:", summaryDataGlobal?.title);
        const mindsPrompt = getMindsPrompt(summaryRequest.title, summaryRequest.author);

        const mindsResult = await generateObject({
          model,
          prompt: mindsPrompt,
          schemaName: "MindsSchema",
          schemaDescription: "Schema for generating minds based on the book",
          schema: z.object({
            minds: z.string().array(),
            questions: z.string().array()
          })
        });

        console.log("Inserting minds data...");
        if (mindsResult?.object) {
          for (const mind of mindsResult.object.minds) {
            try {
              const { error: mindsError } = await supabaseAdmin.from("minds").insert({
                text: mind,
                summary_id: summaryDataGlobal?.id as number,
                question: mindsResult.object.questions[mindsResult.object.minds.indexOf(mind)]
              });

              if (mindsError) {
                throw new Error("Error inserting mind");
              }
            } catch (error) {
              console.error("Error while generating mind", error);
              continue;
            }
          }
        }

        console.log("Deleting summary request...");
        const { error: deleteError } = await supabaseAdmin
          .from("summary_requests")
          .delete()
          .eq("id", summaryRequest.id);

        if (deleteError) {
          throw new Error("Error while deleting summary request");
        }

        console.log("Successfully generated minds for summary request", summaryRequest);
      } catch (error) {
        console.error("Error while generating summary", error);
        continue;
      }
    }
  } catch (error) {
    console.error("Error while generating summaries", error);
    return new Response("Error while generating summaries", { status: 500 });
  }
}
