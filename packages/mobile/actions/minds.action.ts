"use server";

import { supabase } from "@/lib/supabase";

/**
 * Fetches all minds along with their associated summaries, authors, and topics.
 * @returns {Promise<(Tables<"minds"> & { summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics">; }; })[]>} - A promise that resolves to an array of minds.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
export async function getAllMinds() {
  const { data, error } = await supabase
    .from("minds")
    .select("*, summaries(title, production, authors(name, production), topics(name, production))")
    .match({
      production: true,
      "summaries.production": true,
      "summaries.authors.production": true,
      "summaries.topics.production": true,
    });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des citations");
  }

  const minds =
    data
      ?.map((mind) => {
        if (!mind?.summaries?.authors || !mind?.summaries?.topics) {
          return null;
        }

        return {
          ...mind,
          summaries: {
            ...mind?.summaries,
            authors: mind?.summaries?.authors,
            topics: mind?.summaries?.topics,
          },
        };
      })
      ?.filter((mind) => mind !== null) ?? [];

  return minds;
}

/**
 * Saves a mind for a user.
 * @param {number} mindId - The ID of the mind to save.
 * @param {string} userId - The ID of the user saving the mind.
 * @throws {Error} - Throws an error if the save operation fails.
 * @returns {Promise<{ message: string }>} - A promise that resolves to a success message.
 */
export async function saveMind(mindId: number, userId: string) {
  const { error } = await supabase.from("saved_minds").insert({
    user_id: userId,
    mind_id: mindId,
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de sauvegarder le mind.");
  }

  return { message: "Le mind a été sauvegardé avec succès." };
}

/**
 * Unsaves a mind for a user.
 * @param {number} mindId - The ID of the mind to unsave.
 * @param {string} userId - The ID of the user unsaving the mind.
 * @throws {Error} - Throws an error if the unsave operation fails.
 * @returns {Promise<{ message: string }>} - A promise that resolves to a success message.
 */
export async function unsaveMind(mindId: number, userId: string) {
  const { error } = await supabase
    .from("saved_minds")
    .delete()
    .match({ mind_id: mindId, user_id: userId });

  if (error) {
    console.error(error);
    throw new Error("Impossible de retirer le mind.");
  }

  return { message: "Le mind a été retiré avec succès." };
}

/**
 * Likes a mind for a user.
 * @param {number} mindId - The ID of the mind to like.
 * @param {string} userId - The ID of the user liking the mind.
 * @throws {Error} - Throws an error if the like operation fails.
 * @returns {Promise<{ message: string }>} - A promise that resolves to a success message.
 */
export async function likeMind(mindId: number, userId: string) {
  const { error } = await supabase.from("liked_minds").insert({
    user_id: userId,
    mind_id: mindId,
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de liker le mind.");
  }

  return { message: "Le mind a été liké avec succès." };
}

/**
 * Unlikes a mind for a user.
 * @param {number} mindId - The ID of the mind to unlike.
 * @param {string} userId - The ID of the user unliking the mind.
 * @throws {Error} - Throws an error if the unlike operation fails.
 * @returns {Promise<{ message: string }>} - A promise that resolves to a success message.
 */
export async function unlikeMind(mindId: number, userId: string) {
  const { error } = await supabase
    .from("liked_minds")
    .delete()
    .match({ mind_id: mindId, user_id: userId });

  if (error) {
    console.error(error);
    throw new Error("Impossible de retirer le like du mind.");
  }

  return { message: "Le like du mind a été retiré avec succès." };
}

/**
 * Checks if minds are saved for a user.
 * @param {number[]} mindIds - An array of mind IDs to check.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<boolean[]>} - A promise that resolves to an array indicating whether each mind is saved.
 * @throws {Error} - Throws an error if the check operation fails.
 */
export async function areMindsSaved(mindIds: number[], userId: string) {
  const { data, error } = await supabase
    .from("saved_minds")
    .select("mind_id")
    .eq("user_id", userId)
    .in("mind_id", mindIds);

  if (error) {
    console.error(error);
    throw new Error("Impossible de vérifier si les minds sont sauvegardés.");
  }

  const savedMinds = mindIds?.map((mindId) =>
    data?.some((savedMind) => savedMind?.mind_id === mindId),
  );

  return savedMinds;
}

/**
 * Checks if minds are liked for a user.
 * @param {number[]} mindIds - An array of mind IDs to check.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<boolean[]>} - A promise that resolves to an array indicating whether each mind is liked.
 * @throws {Error} - Throws an error if the check operation fails.
 */
export async function areMindsLiked(mindIds: number[], userId: string) {
  const { data, error } = await supabase
    .from("liked_minds")
    .select("mind_id")
    .eq("user_id", userId)
    .in("mind_id", mindIds);

  if (error) {
    console.error(error);
    throw new Error("Impossible de vérifier si les minds sont sauvegardés.");
  }

  const likedMinds = mindIds?.map((mindId) =>
    data?.some((likedMind) => likedMind?.mind_id === mindId),
  );

  return likedMinds;
}

/**
 * Fetches minds associated with a specific summary ID.
 * @param {number} summaryId - The ID of the summary to fetch minds for.
 * @returns {Promise<(Tables<"minds"> & { summaries: Tables<"summaries"> & { authors: Tables<"authors">; }; })[]>} - A promise that resolves to an array of minds.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
export async function getMindsBySummaryId(summaryId: number) {
  const { data: minds, error } = await supabase
    .from("minds")
    .select("*, summaries(title, authors(name))")
    .match({
      summary_id: summaryId,
      production: true,
    });

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des citations");
  }

  return minds;
}

/**
 * Gets the count of how many times a mind has been saved.
 * @param {number} mindId - The ID of the mind.
 * @returns {Promise<number>} - A promise that resolves to the count of saved minds.
 * @throws {Error} - Throws an error if the count operation fails.
 */
export async function getSavedMindCount(mindId: number) {
  const { count, error } = await supabase
    .from("saved_minds")
    .select("mind_id, minds(production)", {
      count: "exact",
      head: true,
    })
    .match({ mind_id: mindId, "minds.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le nombre de sauvegardes.");
  }

  return count;
}

/**
 * Gets the count of how many times a mind has been liked.
 * @param {number} mindId - The ID of the mind.
 * @returns {Promise<number>} - A promise that resolves to the count of liked minds.
 * @throws {Error} - Throws an error if the count operation fails.
 */
export async function getLikedMindCount(mindId: number) {
  const { count, error } = await supabase
    .from("liked_minds")
    .select("mind_id, minds(production)", {
      count: "exact",
      head: true,
    })
    .match({ mind_id: mindId, "minds.production": true });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les minds sauvegardés.");
  }

  return count;
}

/**
 * Checks if a mind is saved for a user.
 * @param {number} mindId - The ID of the mind.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the mind is saved, false otherwise.
 * @throws {Error} - Throws an error if the check operation fails.
 */
export async function isMindSaved(mindId: number, userId: string) {
  const { data, error } = await supabase
    .from("saved_minds")
    .select("mind_id")
    .match({ mind_id: mindId, user_id: userId })
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de vérifier si le mind est sauvegardé.");
  }

  const isSaved = data?.mind_id === mindId;

  return isSaved;
}

/**
 * Checks if a mind is liked for a user.
 * @param {number} mindId - The ID of the mind.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the mind is liked, false otherwise.
 * @throws {Error} - Throws an error if the check operation fails.
 */
export async function isMindLiked(mindId: number, userId: string) {
  const { data, error } = await supabase
    .from("liked_minds")
    .select("mind_id")
    .match({ mind_id: mindId, user_id: userId })
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de vérifier si le mind est liké.");
  }

  const isLiked = data?.mind_id === mindId;

  return isLiked;
}
