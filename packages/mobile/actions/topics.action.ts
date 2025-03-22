"use server";

import { supabase } from "@/lib/supabase";

/**
 * Get all topics
 *
 * @returns {Promise<Tables<'topics'>[]>} - A promise that resolves to an array of topics.
 */
export async function getTopics() {
  const { error, data: topics } = await supabase.from("topics").select("*").eq("production", true);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des topics");
  }

  return topics;
}

/**
 * Get a topic by its ID
 *
 * @param topicId - The ID of the topic
 * @returns {Promise<Tables<'topics'> | null>} - A promise that resolves to the topic.
 */
export async function getTopicName(topicId: number) {
  const { error, data } = await supabase
    .from("topics")
    .select("id, name")
    .eq("id", topicId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération du nom de topic.");
  }

  const topicName = data?.name ?? "Thème";

  return topicName;
}

/**
 * Get the number of summaries for each topic
 *
 * @returns {Promise<Record<number, number>} - A promise that resolves to a record of topic IDs and their respective number of summaries.
 */
export async function getSummariesCountByTopic() {
  const { error, data } = await supabase
    .from("summaries")
    .select("topic_id")
    .eq("production", true);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des thèmes");
  }

  const summariesCount = data?.reduce((acc: Record<number, number>, summary) => {
    const topicId = summary.topic_id;
    acc[topicId] = acc[topicId] ? acc[topicId] + 1 : 1;

    return acc;
  }, {});

  return summariesCount;
}
