"use server";

import { supabase } from "@/lib/supabase";

/**
 * Retrieves the user's level data.
 *
 * @param userId
 * @returns {Promise<{ xp: number, level: number, xp_for_next_level: number, xp_of_current_level: number, progression: number }>} - A promise that resolves to the user's level data.
 * @throws {Error} Throws an error if there is an issue retrieving the user level.
 */
export async function getUserLevel(userId: string) {
  const { data, error } = await supabase.rpc("get_user_level", {
    data: {
      user_id: userId,
    },
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le niveau.");
  }

  const { xp, level, xp_for_next_level, xp_of_current_level, progression } = data?.[0] ?? {};

  return {
    xp,
    level,
    xp_for_next_level,
    xp_of_current_level,
    progression,
  };
}
