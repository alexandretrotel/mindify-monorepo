"use server";
import "server-only";

import { UUID } from "crypto";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { Enums, Tables } from "@/types/supabase";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function addSummaryToLibrary(userId: UUID, summaryId: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("saved_summaries").insert({
    user_id: userId,
    summary_id: summaryId
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible d'ajouter le résumé à votre bibliothèque.");
  }

  revalidatePath("/", "layout");
  return { error };
}

export async function removeSummaryFromLibrary(userId: UUID, summaryId: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("saved_summaries")
    .delete()
    .eq("user_id", userId)
    .eq("summary_id", summaryId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de supprimer le résumé de votre bibliothèque.");
  }

  revalidatePath("/", "layout");
  return { error };
}

export async function markSummaryAsRead(userId: UUID, summaryId: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("read_summaries").insert({
    user_id: userId,
    summary_id: summaryId
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de marquer le résumé comme lu.");
  }

  revalidatePath("/", "layout");
  return { error };
}

export async function markSummaryAsUnread(userId: UUID, summaryId: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("read_summaries")
    .delete()
    .eq("user_id", userId)
    .eq("summary_id", summaryId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de marquer le résumé comme non lu.");
  }

  revalidatePath("/", "layout");
  return { error };
}

export async function getSummaryFromSlugs(author_slug: string, slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("summaries")
    .select("*, authors(*), topics(*), chapters(*)")
    .match({ slug, "authors.slug": author_slug, production: true })
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le résumé.");
  }

  return data;
}

export async function getAdminSummaryFromSlugs(author_slug: string, slug: string) {
  const { data, error } = await supabaseAdmin
    .from("summaries")
    .select("*, authors(*), topics(*)")
    .match({ slug, "authors.slug": author_slug, production: true })
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le résumé.");
  }

  return data;
}

export async function getSummariesReadsCount() {
  const supabase = await createClient();

  const { data: userReadsData, error } = await supabase.from("read_summaries").select("summary_id");

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

interface SummaryReadCount {
  count: number;
  summary: Tables<"summaries"> & { author_slug: string; topic: string } & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
  };
}

interface SummaryReadCounts {
  [key: number]: SummaryReadCount;
}

export async function getMostPopularSummariesFromSameTopic(
  topicId: number,
  summary: Tables<"summaries">
) {
  const supabase = await createClient();

  const { data: userReadsData, error } = await supabase
    .from("read_summaries")
    .select("*, summaries(*, topics(*), authors(*))")
    .match({ "summaries.topic_id": topicId, "summaries.production": true })
    .neq("summary_id", summary.id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés populaires par catégorie.");
  }

  const excludeSameTopics = userReadsData?.filter((read) => read.summaries);

  const summaryReadCounts = excludeSameTopics?.reduce<SummaryReadCounts>((acc, read) => {
    const summaryId = read?.summary_id;

    if (!acc[summaryId]) {
      acc[summaryId] = {
        count: 0,
        summary: {
          ...read?.summaries,
          author_slug: read?.summaries?.authors?.slug as string,
          topic: read?.summaries?.topics?.name as string,
          author_id: read?.summaries?.author_id as number,
          chapters_id: read?.summaries?.chapters_id as number | null,
          created_at: read?.summaries?.created_at as string,
          id: read?.summaries?.id as number,
          image_url: read?.summaries?.image_url as string | null,
          reading_time: read?.summaries?.reading_time as number | null,
          slug: read?.summaries?.slug as string,
          source_type: read?.summaries?.source_type as Enums<"source">,
          source_url: read?.summaries?.source_url as string | null,
          title: read?.summaries?.title as string,
          topic_id: read?.summaries?.topic_id as number,
          topics: read?.summaries?.topics as Tables<"topics">,
          authors: read?.summaries?.authors as Tables<"authors">,
          mindify_ai: read?.summaries?.mindify_ai as boolean,
          production: read?.summaries?.production as boolean
        }
      };
    }

    acc[summaryId].count++;
    return acc;
  }, {});

  const summaryReadCountsArray: {
    count: number;
    summary: Tables<"summaries"> & { author_slug: string; topic: string } & {
      topics: Tables<"topics">;
      authors: Tables<"authors">;
    };
  }[] = Object.values(summaryReadCounts);

  const sortedSummaryReadsCount = [...summaryReadCountsArray]
    ?.sort((a, b) => b.count - a.count)
    ?.map((summaryReadCountsObject) => summaryReadCountsObject?.summary);

  return sortedSummaryReadsCount;
}

export async function getMostPopularSummaries() {
  const supabase = await createClient();

  const { data: userReadsData, error } = await supabase
    .from("read_summaries")
    .select("*, summaries(*, topics(*), authors(*))")
    .eq("summaries.production", true);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés populaires.");
  }

  const summaryReadCounts = userReadsData?.reduce<SummaryReadCounts>((acc, read) => {
    const summaryId = read?.summary_id;

    if (!acc[summaryId]) {
      acc[summaryId] = {
        count: 0,
        summary: {
          ...read?.summaries,
          author_slug: read?.summaries?.authors?.slug as string,
          topic: read?.summaries?.topics?.name as string,
          author_id: read?.summaries?.author_id as number,
          chapters_id: read?.summaries?.chapters_id as number | null,
          created_at: read?.summaries?.created_at as string,
          id: read?.summaries?.id as number,
          image_url: read?.summaries?.image_url as string | null,
          reading_time: read?.summaries?.reading_time as number | null,
          slug: read?.summaries?.slug as string,
          source_type: read?.summaries?.source_type as Enums<"source">,
          source_url: read?.summaries?.source_url as string | null,
          title: read?.summaries?.title as string,
          topic_id: read?.summaries?.topic_id as number,
          topics: read?.summaries?.topics as Tables<"topics">,
          authors: read?.summaries?.authors as Tables<"authors">,
          mindify_ai: read?.summaries?.mindify_ai as boolean,
          production: read?.summaries?.production as boolean
        }
      };
    }

    acc[summaryId].count++;
    return acc;
  }, {});

  const summaryReadCountsArray: {
    count: number;
    summary: Tables<"summaries"> & { author_slug: string; topic: string } & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  }[] = Object.values(summaryReadCounts);

  const sortedSummaryReadsCount = [...summaryReadCountsArray]
    ?.sort((a, b) => b.count - a.count)
    ?.map((summaryReadCountsObject) => summaryReadCountsObject?.summary);

  return sortedSummaryReadsCount;
}

export async function countSummariesByTopicId(topicId: number) {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("summaries")
    .select("*", { count: "exact", head: true })
    .match({ topic_id: topicId, production: true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de compter les résumés.");
  }

  return count as number;
}

export async function getFirstSummaries(number: number) {
  const supabase = await createClient();

  const { data: summaries, error } = await supabase
    .from("summaries")
    .select("*, topics(*), authors(*)")
    .eq("production", true)
    .limit(number);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés.");
  }

  return summaries;
}
