"use server";

import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";

/**
 * Get all summaries
 *
 * @returns {Promise<(Tables<'summaries'> & { authors: Tables<'authors'>; topics: Tables<'topics'> })[]>} - A promise that resolves to an array of summaries.
 */
export async function getSummaries() {
  const { error, data } = await supabase
    .from("summaries")
    .select("*, authors(name, slug, description), topics(name, slug)")
    .eq("production", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des résumés");
  }

  const summaries =
    data
      ?.map((summary) => {
        if (!summary.authors || !summary.topics) {
          return null;
        }

        return {
          ...summary,
          authors: summary.authors,
          topics: summary.topics,
        };
      })
      ?.filter((summary) => summary !== null) ?? [];

  return summaries;
}

/**
 * Get the summaries from their IDs
 *
 * @param summaryIds - The IDs of the summaries
 */
export async function getSummariesFromIds(summaryIds: number[]) {
  const { data, error } = await supabase
    .from("summaries")
    .select("*, authors(name, slug, description), topics(name, slug)")
    .in("id", summaryIds);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des résumés");
  }

  const summaries =
    data
      ?.map((summary) => {
        if (!summary.authors || !summary.topics) {
          return null;
        }

        return {
          ...summary,
          authors: summary.authors,
          topics: summary.topics,
        };
      })
      ?.filter((summary) => summary !== null) ?? [];

  return summaries;
}

/**
 * Get the number of times a summary has been saved
 *
 * @param summaryId - The ID of the summary
 * @returns {Promise<number>} - A promise that resolves to the number of saved summaries
 */
export async function getSummarySavedCount(summaryId: number) {
  const { count, error } = await supabase
    .from("saved_summaries")
    .select("*, summaries(production)", { count: "exact" })
    .match({ summary_id: summaryId, "summaries.production": true });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération du nombre de sauvegardes");
  }

  return count ?? 0;
}

/**
 * Get the number of reads for a summary
 *
 * @param summaryId - The ID of the summary
 * @returns {Promise<number>} - A promise that resolves to the number of reads
 */
export async function getSummaryReadCount(summaryId: number) {
  const { count, error } = await supabase
    .from("read_summaries")
    .select("*, summaries(production)", { count: "exact" })
    .match({ summary_id: summaryId, "summaries.production": true });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération du nombre de lectures");
  }

  return count ?? 0;
}

/**
 * Get the rating for a summary
 *
 * @param summaryId - The ID of the summary
 * @returns {Promise<number>} - A promise that resolves to the average rating
 */
export async function getSummaryRating(summaryId: number) {
  const { data: ratings, error } = await supabase
    .from("summary_ratings")
    .select("rating")
    .eq("summary_id", summaryId);

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération de la note");
  }

  const averageRating = ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;

  if (isNaN(averageRating)) {
    return 0;
  }

  return averageRating;
}

/**
 * Get the number of ratings for a summary
 *
 * @param summaryId - The ID of the summary
 * @returns {Promise<number>} - A promise that resolves to the number of ratings
 */
export async function getSummary(summaryId: number) {
  const { data: summary, error } = await supabase
    .from("summaries")
    .select("*, authors(name, slug, description), topics(name, slug, id), chapters(*)")
    .match({ id: summaryId, production: true })
    .single();

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération du résumé");
  }

  return summary;
}

/**
 * Get the summaries for a topic
 *
 * @param topicId - The ID of the topic
 * @returns {Promise<(Tables<'summaries'> & { authors: Tables<'authors'>; topics: Tables<'topics'> })[]>} - A promise that resolves to an array of summaries
 */
export async function getSummariesByTopicId(topicId: number) {
  const { error, data: summaries } = await supabase
    .from("summaries")
    .select("*, authors(name, slug, description), topics(name, slug)")
    .match({ topic_id: topicId, production: true });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des résumés");
  }

  return summaries;
}

/**
 * Rate a summary
 *
 * @param userId - The ID of the user
 * @param summaryId - The ID of the summary
 * @returns {Promise<{ success: boolean }>} - A promise that resolves to a success message
 */
export async function rateSummary(userId: string, summaryId: number, rating: number) {
  const { error } = await supabase
    .from("summary_ratings")
    .upsert({ user_id: userId, summary_id: summaryId, rating });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la notation du résumé");
  }

  return { success: true };
}

/**
 * Get the best rated summaries
 *
 * @returns {Promise<(Tables<'summaries'> & { authors: Tables<'authors'>; topics: Tables<'topics'> })[]>} - A promise that resolves to an array of summaries
 */
export async function getBestRatedSummaries() {
  const { error, data } = await supabase
    .from("summary_ratings")
    .select("*, summaries(*, authors(name, slug, description), topics(name, slug))")
    .eq("summaries.production", true)
    .order("rating", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des résumés");
  }

  const summaries: {
    [key: number]: {
      rating: number;
      summary: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
    };
  } = data.reduce((acc, { rating, summaries }) => {
    const summary = summaries;

    if (!summary) {
      return acc;
    }

    return {
      ...acc,
      [summary.id]: {
        rating,
        summary,
      },
    };
  }, {});

  const bestRatedSummaries = Object.values(summaries)
    .sort((a, b) => b.rating - a.rating)
    .map((summary) => summary.summary);

  return bestRatedSummaries;
}
