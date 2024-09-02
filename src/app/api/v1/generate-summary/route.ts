import { createAdminClient } from "@/utils/supabase/admin";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { toSlug } from "@/utils/string";

export const dynamic = "force-dynamic";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!
});

const model = google("gemini-1.5-flash-latest");

// TODO: support other summaries than books
const getAuthorPrompt = (authorName: string): string => {
  const prompt = `Résume en français de manière concise la biographie de ${authorName} sans faire allusion à un livre en particulier. Renvoie également un slug qui correspond au nom de l'auteur.`;

  return prompt;
};

const getSummaryPrompt = (title: string, authorName: string): string => {
  const prompt = `
Mission : Résumer le concept et les leçons de "${title}" de ${authorName} en 5 à 8 chapitres captivants en français.

Pour chaque chapitre :

1. Choisis un sous-titre accrocheur, formé d'une seule phrase exprimant une action ou une émotion (évite d'utiliser le signe “:” pour ne pas casser le rythme).  
2. Inclue les leçons clés de manière concise et percutante.  
3. Utilise du storytelling et des exemples concrets pour simplifier et vulgariser les concepts abordés au sein des chapitres plutôt que de faire du contenu théorique.   
5. Assure-toi d'avoir autant de sous-titres que de chapitres (de 5 à 8 chapitres au total).  
6. Rends le texte dynamique, engageant et facile à lire, environ 200 mots par chapitre.

Introduction et Conclusion :  

- Rédige une introduction et une conclusion, chacune d’environ 200 mots.  
- Dans l’introduction, incite à la découverte des leçons du livre à travers un style narratif engageant, sans mentionner directement qu'il s'agit d'un livre. Utilise des variantes créatives (ne commence pas par "imaginez").  
- La conclusion doit réitérer les apprentissages clés et l'impact potentiel sur le lecteur, toujours en restant dans une approche narrative et inspirante.

Détails supplémentaires :

- La longueur totale du texte doit avoisiner les 2000 mots (+/- 200 mots).  
- Fournis également une estimation du temps de lecture global.  

Objectif : Offrir une expérience de lecture immersive et instructive, en capturant l’essence de "${title}" tout en facilitant la compréhension des concepts pour un public large.
    `;

  return prompt;
};

const getMindsPrompt = (title: string, authorName: string): string => {
  const prompt = `
Un MIND est une idée extraite d’un média assez courte et concise sous la forme d'une citation (entre 200 et 500 caractères). Il s’agit plus précisément du résumé d’une notion ou d’un concept clé du média source. Ainsi, les utilisateurs peuvent lire des MINDS, les sauvegarder dans leur librairie et les garder en mémoire pour les réviser. Les utilisateurs premium seuls auront accès à cette fonctionnalité de révision qui se fera sous forme de flashcards. Il est écrit du point de vue de l'auteur.

Écrit entre 6 et 10 minds sur le livre ${title} de ${authorName}.
    `;

  return prompt;
};

export async function POST() {
  // TODO: protect this API route to be executed only once per day by cron job
  const supabaseAdmin = createAdminClient();

  try {
    const { data, error } = await supabaseAdmin.from("summary_requests").select("*");

    if (error) {
      return new Response("Error while fetching summary requests", { status: 500 });
    }

    if (!data || data.length === 0) {
      return new Response("No summary request to generate", { status: 200 });
    }

    for (const summaryRequest of data) {
      // filter to keep only validated requests
      if (!summaryRequest?.validated) {
        continue;
      }

      console.log("Generating summary for request", summaryRequest);

      // generate all the content from the request
      const authorPrompt = getAuthorPrompt(summaryRequest.author);

      const authorResult = await generateObject({
        model,
        prompt: authorPrompt,
        schema: z.object({
          description: z.string().min(200).max(500)
        })
      });

      const authorSlug = toSlug(summaryRequest.author);

      const { data: authorData, error: authorError } = await supabaseAdmin
        .from("authors")
        .insert({
          name: summaryRequest.author,
          slug: authorSlug,
          description: authorResult?.object?.description
        })
        .select()
        .maybeSingle();

      if (authorError) {
        // TODO: handle author error (real error or author already exists ?)
      }

      const summaryPrompt = getSummaryPrompt(summaryRequest.title, summaryRequest.author);

      const summaryResult = await generateObject({
        model,
        prompt: summaryPrompt,
        schema: z.object({
          introduction: z.string().min(100).max(800),
          conclusion: z.string().min(100).max(800),
          readingTime: z.number(),
          chaptersTitle: z.string().min(10).max(100).array(),
          chaptersText: z.string().min(100).max(1400).array()
        })
      });

      const { data: chaptersData, error: chaptersError } = await supabaseAdmin
        .from("chapters")
        .insert({
          titles: summaryResult?.object?.chaptersTitle,
          texts: summaryResult?.object?.chaptersText
        })
        .select()
        .maybeSingle();

      if (chaptersError) {
        // TODO: handle errors
      }

      const summaryTitleSlug = toSlug(summaryRequest.title);

      const { data: summaryData, error: summaryError } = await supabaseAdmin
        .from("summaries")
        .insert({
          title: summaryRequest.title,
          slug: summaryTitleSlug,
          topic_id: summaryRequest.topic_id,
          author_id: authorData?.id as number,
          chapters_id: chaptersData?.id,
          source_type: summaryRequest.source,
          introduction: summaryResult?.object?.introduction,
          conclusion: summaryResult?.object?.conclusion,
          reading_time: summaryResult?.object?.readingTime
        })
        .select()
        .maybeSingle();

      if (summaryError) {
        // TODO: handle error
      }

      const mindsPrompt = getMindsPrompt(summaryRequest.title, summaryRequest.author);

      const mindsResult = await generateObject({
        model,
        prompt: mindsPrompt,
        schema: z.object({
          mindsArray: z.string().min(200).max(500).array()
        })
      });

      if (mindsResult?.object?.mindsArray) {
        for (const mind of mindsResult.object.mindsArray) {
          try {
            const { error: mindsError } = await supabaseAdmin.from("minds").insert({
              text: mind,
              summary_id: summaryData?.id as number
            });

            if (mindsError) {
              // TODO handle errors
              console.error("Error inserting mind:", mindsError);
            }
          } catch (error) {
            console.error("Error inserting minds:", error);
          }
        }
      }

      // TODO: delete the summary once added to the summary table
    }

    return new Response("Summary generation done", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("An error occured while generating summaries", { status: 500 });
  }
}
