"use server";
import "server-only";

import { UUID } from "crypto";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { Authors, Summaries, Summary, SummaryChapters } from "@/types/summary";
import { getUserReads } from "@/actions/users";
import type { UserReads } from "@/types/user";
import type { Topics } from "@/types/topics";

export async function addSummaryToLibrary(userId: UUID, summaryId: number) {
  const supabase = createClient();

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
  const supabase = createClient();

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
  const supabase = createClient();

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
  const supabase = createClient();

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
  const supabase = createClient();

  const { data, error } = await supabase
    .from("summaries")
    .select("*, authors(slug)")
    .eq("slug", slug)
    .eq("authors.slug", author_slug);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le résumé.");
  }

  const summary = data[0] as Summary;

  return summary;
}

export async function getSummaryChapters(summary_id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("summaries")
    .select("*, chapters(*)")
    .eq("id", summary_id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le chapitre du résumé.");
  }

  const summaryChapters = data[0] as SummaryChapters;

  return summaryChapters;
}

export async function getSummariesReadsCount() {
  const supabase = createClient();

  const { data: userReadsData, error } = await supabase
    .from("user_reads")
    .select("*, summaries(*, topics(name), authors(slug))");

  console.log("userReadsData", userReadsData);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés populaires par catégorie.");
  }

  const summaryReadCounts = userReadsData?.reduce((acc: Record<number, number>, read) => {
    const summaryId = read?.summary_id;

    if (!acc[summaryId]) {
      acc[summaryId] = 0;
    }

    acc[summaryId]++;
    return acc;
  }, {});

  return summaryReadCounts; // key is summaryId, value is number of reads
}

export async function getMostPopularSummariesFromSameTopic(topicId: number, summary: Summary) {
  const supabase = createClient();

  const { data: userReadsData, error } = await supabase
    .from("user_reads")
    .select("*, summaries(*, topics(name), authors(slug))")
    .eq("summaries.topic_id", topicId)
    .neq("summary_id", summary.id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés populaires par catégorie.");
  }

  const excludeSameTopics = userReadsData?.filter((read) => read.summaries);

  const summaryReadCounts = excludeSameTopics?.reduce((acc, read) => {
    const summaryId = read?.summary_id;

    if (!acc[summaryId]) {
      acc[summaryId] = {
        count: 0,
        summary: {
          ...read?.summaries,
          author_slug: read?.summaries?.authors?.slug,
          topic: read?.summaries?.topics?.name
        }
      };
    }

    acc[summaryId].count++;
    return acc;
  }, {});

  const summaryReadCountsArray: {
    count: number;
    summary: Summary;
  }[] = Object.values(summaryReadCounts);

  const sortedSummaryReadsCount = [...summaryReadCountsArray]
    ?.sort((a, b) => b.count - a.count)
    ?.map((summaryReadCountsObject) => summaryReadCountsObject?.summary);

  return sortedSummaryReadsCount;
}

export async function getMostPopularSummaries() {
  const supabase = createClient();

  const { data: userReadsData, error } = await supabase
    .from("user_reads")
    .select("*, summaries(*, topics(name), authors(slug))");

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés populaires par catégorie.");
  }

  const excludeSameTopics = userReadsData?.filter((read) => read.summaries);

  const summaryReadCounts = excludeSameTopics?.reduce((acc, read) => {
    const summaryId = read?.summary_id;

    if (!acc[summaryId]) {
      acc[summaryId] = {
        count: 0,
        summary: {
          ...read?.summaries,
          author_slug: read?.summaries?.authors?.slug,
          topic: read?.summaries?.topics?.name
        }
      };
    }

    acc[summaryId].count++;
    return acc;
  }, {});

  const summaryReadCountsArray: {
    count: number;
    summary: Summary;
  }[] = Object.values(summaryReadCounts);

  const sortedSummaryReadsCount = [...summaryReadCountsArray]
    ?.sort((a, b) => b.count - a.count)
    ?.map((summaryReadCountsObject) => summaryReadCountsObject?.summary);

  return sortedSummaryReadsCount;
}

export async function countSummariesByTopicId(topicId: number) {
  const supabase = createClient();

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

export async function getPopulatedSummaries() {
  const supabase = createClient();

  const { data: userReadsData, error } = await supabase
    .from("user_reads")
    .select("*, summaries(*, topics(name), authors(slug))");

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés populaires par catégorie.");
  }

  const summaryReadCounts = userReadsData?.reduce((acc, read) => {
    const summaryId = read?.summary_id;

    if (!acc[summaryId]) {
      acc[summaryId] = {
        count: 0,
        summary: {
          ...read?.summaries,
          author_slug: read?.summaries?.authors?.slug,
          topic: read?.summaries?.topics?.name
        }
      };
    }

    acc[summaryId].count++;
    return acc;
  }, {});

  const summaryReadCountsArray: {
    count: number;
    summary: Summary;
  }[] = Object.values(summaryReadCounts);

  const summaries = summaryReadCountsArray?.map(({ count, summary }) => ({
    ...summary,
    number_of_reads: count
  })) as Summaries;

  return summaries;
}
