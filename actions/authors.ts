"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import type { Author } from "@/types/summary/summary";

export async function getAuthorFromSlug(slug: string) {
  const supabase = createClient();

  const { data: authorData, error } = await supabase.from("authors").select("*").eq("slug", slug);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer l'auteur.");
  }

  const author = authorData[0] as Author;

  return author;
}

export async function getAuthorFromSummaryId(summaryId: number) {
  const supabase = createClient();

  const { data, error } = await supabase.from("summaries").select("authors(*)").eq("id", summaryId);
  console.log("data", data);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer l'auteur.");
  }

  const author = data?.flatMap((summary) => summary.authors)[0] as Author;

  return author;
}
