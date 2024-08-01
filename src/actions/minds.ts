"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";

export async function getMindsFromSummaryId(summaryId: number) {
  const supabase = createClient();

  const { data: mindsData, error } = await supabase
    .from("minds")
    .select("*")
    .eq("summary_id", summaryId);

  if (error) {
    throw new Error("Impossible de récupérer les minds.");
  }

  return mindsData;
}

export async function getMindsFromTopicId(topicId: number) {
  const supabase = createClient();

  const { data: mindsData, error } = await supabase
    .from("minds")
    .select("*, summaries(*)")
    .eq("summaries.topic_id", topicId);

  if (error) {
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
  const supabase = createClient();

  const { data: savedMindsData, error } = await supabase.from("saved_minds").select("*, minds(*)");

  if (error) {
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
          created_at: read?.minds?.created_at as string
        }
      };
    }

    acc[mindId].count++;
    return acc;
  }, {});

  const savedMindsCountsArray: {
    count: number;
    mind: Tables<"minds">;
  }[] = Object.values(savedMindsCountsMap);

  const sortedSavedMindsCount = [...savedMindsCountsArray]
    ?.sort((a, b) => b.count - a.count)
    ?.map((savedMindCountsObject) => savedMindCountsObject?.mind);

  return sortedSavedMindsCount;
}

export async function getMindsFromUserId(userId: UUID) {
  const supabase = createClient();

  const { data: mindsData, error } = await supabase
    .from("saved_minds")
    .select("*, minds(*)")
    .eq("user_id", userId);

  if (error) {
    throw new Error("Impossible de récupérer les minds.");
  }

  return mindsData;
}

export async function saveMind(mindId: number) {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  const userId: UUID = userData?.user?.id as UUID;

  if (userError) {
    throw new Error("Impossible de récupérer l'utilisateur");
  }

  const { error } = await supabase.from("saved_minds").insert({
    user_id: userId,
    mind_id: mindId
  });

  if (error) {
    throw new Error("Impossible de sauvegarder le mind.");
  }
}
