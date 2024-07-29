"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { UUID } from "crypto";
import type { Topic, Topics } from "@/types/topics";

export async function addTopic(user_id: UUID, topic_id: number) {
  const supabase = createClient();

  const { error } = await supabase.from("user_topics").insert({
    user_id,
    topic_id
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible d'ajouter l'intérêt'.");
  }

  revalidatePath("/", "layout");
  return { message: "Intérêt ajouté avec succès." };
}

export async function removeTopic(user_id: UUID, topic_id: number) {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_topics")
    .delete()
    .eq("user_id", user_id)
    .eq("topic_id", topic_id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de supprimer l'intérêt.");
  }

  revalidatePath("/", "layout");
  return { message: "Intérêt supprimé avec succès." };
}

export async function getUserTopics(user_id: UUID) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les intérêts.");
  }

  const topics: Topics = data?.flatMap((item: { topics: Topics }) => item.topics) || [];

  return topics;
}

export async function getTopicFromSummaryId(summary_id: number) {
  const supabase = createClient();

  const { data, error } = await supabase.from("summaries").select("topics(*)").eq("id", summary_id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer l'intérêt.");
  }

  const topic = data?.flatMap((item: { topics: Topics }) => item.topics)[0];

  return topic;
}

export async function getTopicFromTopicSlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from("topics").select("*").eq("slug", slug);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer l'intérêt.");
  }

  const topic = data[0] as Topic;

  return topic;
}
