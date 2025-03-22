"use server";

import { supabase } from "@/lib/supabase";
import { getFriendsIds } from "@/actions/friends.action";

/**
 * Get the global leaderboard ranking all users by their XP.
 *
 * @returns {Promise<{ length: number, leaderboard: { user_id: string, xp: number }[] }>}
 * @throws {Error} If there was an error retrieving the leaderboard.
 */
export async function getGlobalLeaderboard() {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("user_id, xp")
    .order("xp", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le leaderboard.");
  }

  const leaderboard = data;
  const length = leaderboard?.length ?? 0;

  return {
    length,
    leaderboard,
  };
}

/**
 * Get the friends leaderboard ranking all friends by their XP.
 *
 * @param userId
 * @returns {Promise<{ length: number, leaderboard: { user_id: string, xp: number }[] }>}
 */
export async function getFriendsLeaderboard(userId: string) {
  const { friendsIds } = await getFriendsIds(userId).catch((error) => {
    console.error(error);
    throw new Error("Impossible de récupérer la liste des amis.");
  });

  const friendsIdsAndUserId = friendsIds.concat([userId]);

  const { data: leaderboardData, error: leaderboardError } = await supabase
    .from("leaderboard")
    .select("user_id, xp")
    .in("user_id", friendsIdsAndUserId)
    .order("xp", { ascending: false });

  if (leaderboardError) {
    console.error(leaderboardError);
    throw new Error("Impossible de récupérer le leaderboard des amis.");
  }

  const leaderboard = leaderboardData;
  const length = leaderboard?.length ?? 0;

  return {
    length,
    leaderboard,
  };
}
