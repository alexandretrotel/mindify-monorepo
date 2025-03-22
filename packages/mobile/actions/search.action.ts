"use server";

import { supabase } from "@/lib/supabase";

/**
 * Searches for users based on a query.
 *
 * @param query - The search query to get users.
 * @returns {Promise<{ id: string; name: string; avatar: string }[]>} - A promise that resolves to an array of users.
 */
export async function searchUsers(query: string) {
  const { data: users, error } = await supabase.rpc("search_users", {
    search_query: query,
  });

  if (error) {
    console.error("Error searching users:", error);
    return [];
  }

  return users;
}

/**
 * Searches for summaries based on a query.
 *
 * @param query - The search query to get summaries.
 * @returns {Promise<(Tables<'summaries'> & { authors: Tables<'authors'> })[]>} - A promise that resolves to an array of summaries.
 */
export async function searchSummaries(query: string) {
  const { data: summaries, error } = await supabase
    .from("summaries")
    .select("*, authors(*)")
    .textSearch("title", query, {
      type: "websearch",
    })
    .eq("production", true);

  if (error) {
    console.error("Error searching summaries:", error);
    return [];
  }

  return summaries;
}
