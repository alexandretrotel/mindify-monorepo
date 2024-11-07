"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";

export async function getMindsFromSummaryId(summaryId: number) {
  const supabase = await createClient();

  const { data: mindsData, error } = await supabase
    .from("minds")
    .select("*, summaries(*, authors(*), topics(*))")
    .match({ summary_id: summaryId, production: true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les minds.");
  }

  return mindsData;
}

interface SavedMindsCount {
  count: number;
  mind: Tables<"minds">;
}

interface SavedMindsCounts {
  [key: number]: SavedMindsCount;
}

export async function getMostSavedMinds() {
  const supabase = await createClient();

  const { data: savedMindsData, error } = await supabase
    .from("saved_minds")
    .select("*, minds(*, summaries(*, topics(*), authors(*)))")
    .eq("summaries.production", true);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les minds populaires.");
  }

  const savedMindsCountsMap = savedMindsData?.reduce<SavedMindsCounts>((acc, read) => {
    const mindId = read?.mind_id;

    if (!acc[mindId]) {
      acc[mindId] = {
        count: 0,
        mind: {
          ...read?.minds,
          id: read?.minds?.id as number,
          text: read?.minds?.text as string,
          summary_id: read?.minds?.summary_id as number,
          created_at: read?.minds?.created_at as string,
          mindify_ai: read?.minds?.mindify_ai as boolean,
          question: read?.minds?.question as string
        }
      };
    }

    acc[mindId].count++;
    return acc;
  }, {});

  const savedMindsCountsArray: {
    count: number;
    mind: Tables<"minds"> & {
      summaries: Tables<"summaries"> & { topics: Tables<"topics">; authors: Tables<"authors"> };
    };
  }[] = Object.values(savedMindsCountsMap);

  const sortedSavedMindsCount = [...savedMindsCountsArray]
    ?.sort((a, b) => b.count - a.count)
    ?.map((savedMindCountsObject) => savedMindCountsObject?.mind);

  return sortedSavedMindsCount;
}

export async function getMindsFromUserId(userId: UUID) {
  const supabase = await createClient();

  const { data: mindsData, error } = await supabase
    .from("saved_minds")
    .select("*, minds(*, summaries(*, topics(*), authors(*)))")
    .match({ user_id: userId, "summaries.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les minds.");
  }

  if (mindsData && mindsData?.length > 0) {
    return mindsData?.map((mind) => mind?.minds);
  } else {
    return [];
  }
}

export async function saveMind(mindId: number, userId: UUID) {
  const supabase = await createClient();

  const { error } = await supabase.from("saved_minds").insert({
    user_id: userId,
    mind_id: mindId
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de sauvegarder le mind.");
  }
}

export async function unsaveMind(mindId: number, userId: UUID) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("saved_minds")
    .delete()
    .eq("user_id", userId)
    .eq("mind_id", mindId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de retirer le mind.");
  }
}

export async function areMindsSaved(mindIds: number[], userId: UUID) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("saved_minds")
    .select("mind_id, minds(production, summaries(production))")
    .match({ "summaries.production": true, user_id: userId })
    .in("mind_id", mindIds);

  if (error) {
    console.error(error);
    throw new Error("Impossible de vérifier si les minds sont sauvegardés.");
  }

  return mindIds?.map((mindId) => data?.some((savedMind) => savedMind?.mind_id === mindId));
}

export async function getRandomMinds() {
  const supabase = await createClient();

  const { data: mindsData, error } = await supabase
    .from("minds")
    .select("*, summaries(*, topics(*), authors(*))")
    .eq("summaries.production", true);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les minds.");
  }

  const randomMinds = [...mindsData]?.sort(() => Math.random() - 0.5);

  return randomMinds as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      topics: Tables<"topics">;
      authors: Tables<"authors">;
    };
  })[];
}
