"use server";
import "server-only";

import { UUID } from "crypto";
import { supabase } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getAuthorFromSlug } from "@/actions/authors";
import type { Authors, Summaries, Summary, SummaryChapters } from "@/types/summary";
import { getUserReads } from "@/actions/users";
import type { UserReads } from "@/types/user";
import type { Topics } from "@/types/topics";

export async function addSummaryToLibrary(userId: UUID, summaryId: number) {
  const { error } = await supabase.from("user_library").insert({
    user_id: userId,
    summary_id: summaryId
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible d'ajouter le résumé à votre bibliothèque.");
  }

  revalidatePath("/(application)", "layout");
  return { error };
}

export async function removeSummaryFromLibrary(userId: UUID, summaryId: number) {
  const { error } = await supabase
    .from("user_library")
    .delete()
    .eq("user_id", userId)
    .eq("summary_id", summaryId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de supprimer le résumé de votre bibliothèque.");
  }

  revalidatePath("/(application)", "layout");
  return { error };
}

export async function markSummaryAsRead(userId: UUID, summaryId: number) {
  const { error } = await supabase.from("user_reads").insert({
    user_id: userId,
    summary_id: summaryId
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de marquer le résumé comme lu.");
  }

  revalidatePath("/(application)", "layout");
  return { error };
}

export async function markSummaryAsUnread(userId: UUID, summaryId: number) {
  const { error } = await supabase
    .from("user_reads")
    .delete()
    .eq("user_id", userId)
    .eq("summary_id", summaryId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de marquer le résumé comme non lu.");
  }

  revalidatePath("/(application)", "layout");
  return { error };
}

export async function getSummaryFromSlugs(author_slug: string, slug: string) {
  const author = await getAuthorFromSlug(author_slug);

  const { data, error } = await supabase
    .from("summaries")
    .select("*")
    .eq("slug", slug)
    .eq("author_id", author?.id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le résumé.");
  }

  const summary = data[0] as Summary;

  return summary;
}

export async function getSummaryChapters(summary_id: number) {
  const { data, error } = await supabase
    .from("summary_chapters")
    .select("*")
    .eq("summary_id", summary_id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le chapitre du résumé.");
  }

  const summaryChapters = data[0] as SummaryChapters;

  return summaryChapters;
}

export async function getMostPopularSummariesFromSameTopic(
  topicId: number,
  summary: Summary,
  userId: UUID,
  limit?: number
) {
  const { data: summariesData } = await supabase
    .from("summaries")
    .select("*, topics(name)")
    .eq("topic_id", topicId)
    .neq("id", summary.id)
    .limit(limit ?? 100);

  const userReads = await getUserReads({ userId });

  const { data: authorsData } = await supabase.from("authors").select("*");
  const authors = authorsData?.flatMap((author) => author) as Authors;

  let summaries: Summaries = summariesData?.map((summary) => ({
    ...summary,
    number_of_reads: userReads?.filter((read) => read?.summary_id === summary?.id)?.length,
    topic: summary?.topics?.name as string,
    author_slug: authors?.find((author) => author?.id === summary?.author_id)?.slug as string
  })) as Summaries;

  const mostPopularSummariesFromSameTopic = summaries
    .filter((summaryLocal) => summaryLocal?.topic_id === summary?.topic_id)
    .sort((a, b) => (b?.number_of_reads as number) - (a?.number_of_reads as number));

  return mostPopularSummariesFromSameTopic;
}

export async function countSummariesByTopicId(topicId: number) {
  const { count, error } = await supabase
    .from("summaries")
    .select("*", { count: "exact", head: true })
    .eq("topic_id", topicId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de compter les résumés.");
  }

  return count as number;
}

export async function getPopulatedSummaries({ userId }: { userId: UUID }) {
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    throw new Error("Impossible de récupérer les résumés.");
  }

  const { data: topicsData } = await supabase.from("topics").select("*");
  const topics = topicsData as Topics;

  const { data: authorData } = await supabase.from("authors").select("*");
  const authors = authorData as Authors;

  const { data: userReadsData } = await supabase.from("user_reads").select("*");
  const userReads: UserReads = userReadsData?.filter(
    (read) => read.user_id === data?.user?.id
  ) as UserReads;

  const { data: summariesData } = await supabase.from("summaries").select("*");
  const summaries: Summaries = summariesData?.map((summary) => ({
    ...summary,
    topic: topics?.find((topic) => topic?.id === summary?.topic_id)?.name,
    author_slug: authors?.find((author) => author?.id === summary?.author_id)?.slug,
    number_of_reads: userReads?.filter((read) => read?.summary_id === summary?.id)?.length
  })) as Summaries;

  return summaries;
}
