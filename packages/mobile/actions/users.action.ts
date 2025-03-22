"use server";

import { supabase } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";
import { getSummariesCountByTopic } from "@/actions/topics.action";

/**
 * Get the topics of a user.
 *
 * @param user_id - The user id.
 * @returns {Promise<Tables<"topics">[]>} The topics of the user.
 */
export async function getUserTopics(user_id: string) {
  const { data, error } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .match({ user_id, "topics.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les intérêts.");
  }

  const topics = Array.isArray(data) ? data?.map((item) => item.topics) : [];

  return topics;
}

/**
 * Get the topics count of a user.
 *
 * @param userId - The user id.
 * @returns {Promise<number>} The topics count of the user.
 */
export async function getUserTopicsCount(userId: string) {
  const { count, error } = await supabase
    .from("user_topics")
    .select("id", {
      count: "exact",
      head: true,
    })
    .match({ user_id: userId, "topics.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les intérêts.");
  }

  return count ?? 0;
}

/**
 * Get the user's read summaries.
 *
 * @param userId - The user id.
 * @returns {Promise<(Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics">; })[]>} The user's read summaries.
 */
export async function getUserReadSummaries(userId: string) {
  const { data, error } = await supabase
    .from("read_summaries")
    .select("*, summaries(*, authors(name), topics(name))")
    .match({ user_id: userId, "summaries.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés lus.");
  }

  const readSummaries =
    data
      ?.map((item) => {
        if (!item?.summaries?.authors || !item?.summaries?.topics) {
          return null;
        }

        return {
          ...item.summaries,
          authors: item.summaries.authors,
          topics: item.summaries.topics,
        };
      })
      ?.filter((item) => item !== null) ?? [];

  return readSummaries;
}

/**
 * Get the user's saved summaries.
 *
 * @param userId - The user id.
 * @returns {Promise<(Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics">; })[]>} The user's read summaries.
 */
export async function getUserSavedSummaries(userId: string) {
  const { data, error } = await supabase
    .from("saved_summaries")
    .select("*, summaries(*, authors(name), topics(name))")
    .match({ user_id: userId, "summaries.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés lus.");
  }

  const savedSummaries =
    data
      ?.map((item) => {
        if (!item?.summaries?.authors || !item?.summaries?.topics) {
          return null;
        }

        return {
          ...item.summaries,
          authors: item.summaries.authors,
          topics: item.summaries.topics,
        };
      })
      ?.filter((item) => item !== null) ?? [];

  return savedSummaries;
}

/**
 * Get the user's read summaries timestamps.
 *
 * @param userId - The user id.
 * @returns {Promise<{ read_at: string }[]>} The user's read summaries timestamps.
 */
export async function getUserReadSummariesTimpestamps(userId: string) {
  const { data, error } = await supabase
    .from("read_summaries")
    .select("read_at, summaries(production)")
    .match({ user_id: userId, "summaries.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés lus.");
  }

  const readSummariesTimestamps = data ?? [];

  return readSummariesTimestamps;
}

/**
 * Get the user's read summaries count.
 *
 * @param userId - The user id.
 * @returns {Promise<number>} The user's read summaries count.
 */
export async function getUserReadSummariesCount(userId: string) {
  const { count, error } = await supabase
    .from("read_summaries")
    .select("user_id, summaries(production)", {
      count: "exact",
      head: true,
    })
    .match({ user_id: userId, "summaries.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les résumés lus.");
  }

  return count ?? 0;
}

/**
 * Get the user's saved minds.
 *
 * @param userId - The user id.
 * @returns {Promise<(Tables<"minds"> & { summaries: Tables<"summaries"> & { authors: Tables<"authors">; }; })[]} The user's saved minds.
 */
export async function getUserSavedMinds(userId: string) {
  const { data, error } = await supabase
    .from("saved_minds")
    .select("*, minds(*, summaries(title, authors(name)))")
    .match({ user_id: userId, "minds.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les esprits sauvegardés.");
  }

  const savedMinds =
    data
      ?.map((item) => {
        if (!item?.minds?.summaries?.authors) {
          return null;
        }

        return {
          ...item.minds,
          summaries: {
            ...item.minds.summaries,
            authors: {
              name: item.minds.summaries.authors.name,
            },
          },
        };
      })
      ?.filter((item) => item !== null) ?? [];

  return savedMinds;
}

/**
 * Get the user's saved minds count.
 *
 * @param userId - The user id.
 * @returns {Promise<number>} The user's saved minds count.
 */
export async function getUserSavedMindsCount(userId: string) {
  const { count, error } = await supabase
    .from("saved_minds")
    .select("user_id, minds(production)", {
      count: "exact",
      head: true,
    })
    .match({ user_id: userId, "minds.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les esprits sauvegardés.");
  }

  return count ?? 0;
}

/**
 * Get the user's SRS data.
 *
 * @param userId - The user id.
 * @returns {Promise<(Tables<"srs_data"> & { minds: Tables<"minds"> & { summaries: Tables<"summaries"> & { authors: Tables<"authors">; }; }; })[]} The user's SRS data.
 */
export async function getUserSrsData(userId: string) {
  const { data, error } = await supabase
    .from("srs_data")
    .select("*, minds(*, summaries(title, authors(name)))")
    .match({ user_id: userId, "minds.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les données SRS.");
  }

  const srsData =
    data
      ?.map((item) => {
        if (!item?.minds?.summaries?.authors) {
          return null;
        }

        return {
          ...item,
          minds: {
            ...item.minds,
            summaries: {
              ...item.minds.summaries,
              authors: {
                name: item.minds.summaries.authors.name,
              },
            },
          },
        };
      })
      ?.filter((item) => item !== null) ?? [];

  return srsData;
}

/**
 * Get if the user has saved the summary.
 *
 * @param userId - The user id.
 * @param summaryId - The summary id.
 * @returns {Promise<boolean>} If the user has saved the summary.
 */
export async function hasUserSavedSummary(userId: string, summaryId: number) {
  const { data, error } = await supabase
    .from("saved_summaries")
    .select("*")
    .match({
      user_id: userId,
      summary_id: summaryId,
    })
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de vérifier si le résumé est sauvegardé.");
  }

  const isSaved = !!data;

  return isSaved;
}

/**
 * Save a summary for a user.
 *
 * @param userId - The user id.
 * @param summaryId - The summary id.
 * @returns {Promise<{ success: boolean }>} The success of the operation.
 */
export async function saveSummary(userId: string | null, summaryId: number) {
  if (!userId) {
    throw new Error("Impossible de sauvegarder le résumé.");
  }

  const { error } = await supabase.from("saved_summaries").insert({
    user_id: userId,
    summary_id: summaryId,
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de sauvegarder le résumé.");
  }

  return { success: true };
}

/**
 * Unsave a summary for a user.
 *
 * @param userId - The user id.
 * @param summaryId - The summary id.
 * @returns {Promise<{ success: boolean }>} The success of the operation.
 */
export async function unsaveSummary(userId: string, summaryId: number) {
  const { error } = await supabase.from("saved_summaries").delete().match({
    user_id: userId,
    summary_id: summaryId,
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de sauvegarder le résumé.");
  }

  return { success: true };
}

/**
 * Mark a summary as read for a user.
 *
 * @param userId - The user id.
 * @param summaryId - The summary id.
 * @returns {Promise<{ success: boolean }>} The success of the operation.
 */
export async function markSummaryAsRead(userId: string, summaryId: number) {
  const { error } = await supabase.from("read_summaries").insert({
    user_id: userId,
    summary_id: summaryId,
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de marquer le résumé comme lu.");
  }

  return { success: true };
}

/**
 * Mark a summary as unread for a user.
 *
 * @param userId - The user id.
 * @param summaryId - The summary id.
 * @returns {Promise<{ success: boolean }>} The success of the operation.
 */
export async function markSummaryAsUnread(userId: string, summaryId: number) {
  const { error } = await supabase.from("read_summaries").delete().match({
    user_id: userId,
    summary_id: summaryId,
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de marquer le résumé comme non lu.");
  }

  return { success: true };
}

/** Get if the user has read the summary.
 *
 * @param userId - The user id.
 * @param summaryId - The summary id.
 * @returns {Promise<boolean>} If the user has read the summary.
 */
export async function hasUserReadSummary(userId: string, summaryId: number) {
  const { data, error } = await supabase
    .from("read_summaries")
    .select("*")
    .match({
      user_id: userId,
      summary_id: summaryId,
    })
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de vérifier si le résumé est lu.");
  }

  const isRead = !!data;

  return isRead;
}

/**
 * Get the metadata of the friends of a user.
 *
 * @param userId - The user id.
 * @returns {Promise<{friend_id: string; created_at: string; raw_user_meta_data: Json;}[]>} The metadata of the friends of the user.
 */
export async function getUserFriends(userId: string) {
  const { data: friends, error } = await supabase.rpc("get_friends_metadata", {
    p_user_id: userId,
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les amis.");
  }

  return friends;
}

/** Get the count of the friends of a user.
 *
 * @param userId - The user id.
 * @returns {Promise<number>} The count of the friends of the user.
 */
export async function getUserFriendsCount(userId: string) {
  const { data: friends, error } = await supabase.rpc("get_friends_metadata", {
    p_user_id: userId,
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le nombre d'amis.");
  }

  return friends?.length ?? 0;
}

/**
 * Update the profile of the user.
 *
 * @param username - The username.
 * @param biography - The biography.
 * @returns {Promise<{ success: boolean }>} The success of the operation.
 */
export async function updateProfile(username: string, biography: string) {
  const { error } = await supabase.auth.updateUser({
    data: {
      name: username,
      biography,
    },
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de mettre à jour le profil.");
  }

  return { success: true };
}

/**
 * Update the topics of the user.
 *
 * @param userId - The user id.
 * @param selectedTopics - The selected topics.
 * @returns {Promise<{ success: boolean }>} The success of the operation.
 */
export async function updateUserTopics(userId: string, selectedTopics: Tables<"topics">[]) {
  const { data, error: errorUserTopics } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", userId);

  if (errorUserTopics) {
    console.error(errorUserTopics);
    throw new Error("Impossible de récupérer les intérêts.");
  }

  const userTopics = data?.map((item) => item.topics) ?? [];

  if (userTopics?.length > 0) {
    const topicsToRemove = userTopics
      .filter((topic) => !selectedTopics.some((selectedTopic) => selectedTopic.id === topic?.id))
      .filter(Boolean);

    if (topicsToRemove?.length > 0) {
      const { error } = await supabase
        .from("user_topics")
        .delete()
        .in(
          "topic_id",
          topicsToRemove.map((topic) => topic?.id),
        );

      if (error) {
        console.error(error);
        throw new Error("Impossible de mettre à jour les intérêts.");
      }
    }
  }

  const topicsToAdd = selectedTopics
    .filter((selectedTopic) => !userTopics.some((topic) => topic?.id === selectedTopic.id))
    .filter(Boolean);

  if (topicsToAdd?.length > 0) {
    const { error: addError } = await supabase.from("user_topics").insert(
      topicsToAdd?.map((topic) => ({
        user_id: userId,
        topic_id: topic?.id,
      })),
    );

    if (addError) {
      console.error(addError);
      throw new Error("Impossible de mettre à jour les intérêts.");
    }
  }

  return { success: true };
}

/**
 * Get the progression of the topics of a user.
 *
 * @param userId - The user id.
 * @returns {Promise<{ topicId: number; count: number; total: number; }[]>} The progression of the topics of the user.
 */
export async function getUserTopicsProgression(userId: string) {
  const { data, error } = await supabase
    .from("read_summaries")
    .select("summaries(*, topics(*))")
    .match({ user_id: userId, "summaries.production": true, "summaries.topics.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer la progression des thèmes.");
  }

  const topicsProgression = data?.reduce((acc: Record<number, number>, summary) => {
    const topicId = summary?.summaries?.topics?.id;

    if (!topicId) {
      return acc;
    }

    acc[topicId] = acc[topicId] ? acc[topicId] + 1 : 1;

    return acc;
  }, {});

  try {
    const summariesCountByTopic = await getSummariesCountByTopic();

    const topicsProgressionWithCount = Object.entries(topicsProgression).map(
      ([topicId, count]) => ({
        topicId: parseInt(topicId),
        count,
        total: summariesCountByTopic?.[parseInt(topicId)],
      }),
    );

    return topicsProgressionWithCount;
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de récupérer la progression des thèmes.");
  }
}

/**
 * Get the user's summary rating.
 *
 * @param userId - The user id.
 * @param summaryId - The summary id.
 * @returns {Promise<number | undefined>} The user's summary rating.
 */
export async function getUserSummaryRating(
  userId: string,
  summaryId: number,
): Promise<number | undefined> {
  const { data, error } = await supabase
    .from("summary_ratings")
    .select("rating")
    .match({ user_id: userId, summary_id: summaryId })
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer la note du résumé.");
  }

  return data?.rating ?? undefined;
}
