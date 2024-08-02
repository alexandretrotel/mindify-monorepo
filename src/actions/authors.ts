"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";

export async function getAuthorFromSlug(slug: string) {
  const supabase = createClient();

  const { data: authorData, error } = await supabase
    .from("authors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer l'auteur.");
  }

  return authorData;
}

export async function getAuthorFromSummaryId(summaryId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("summaries")
    .select("authors(*)")
    .eq("id", summaryId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer l'auteur.");
  }

  return data?.authors;
}

export async function getAuthorSlugFromSummaryId(summaryId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("summaries")
    .select("authors(*)")
    .eq("id", summaryId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le slug de l'auteur.");
  }

  return data?.authors?.slug;
}
