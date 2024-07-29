"use server";
import "server-only";

import { supabase } from "@/utils/supabase/server";
import type { Author } from "@/types/summary";

export async function getAuthorFromSlug(slug: string) {
  const { data: authorData, error } = await supabase.from("authors").select("*").eq("slug", slug);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer l'auteur.");
  }

  const author = authorData[0] as Author;

  return author;
}

export async function getAuthorFromSummaryId(summaryId: number) {
  const { data, error } = await supabase.from("summaries").select("authors(*)").eq("id", summaryId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer l'auteur.");
  }

  const author = data?.flatMap((summary) => summary?.authors)[0] as Author;

  return author;
}

export async function getAuthorSlugFromSummaryId(summaryId: number) {
  const { data, error } = await supabase
    .from("summaries")
    .select("authors(slug)")
    .eq("id", summaryId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le slug de l'auteur.");
  }

  const author_slug = data?.flatMap((summary) => summary?.authors)[0]?.slug as string;

  return author_slug;
}
