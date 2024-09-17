"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import type { Tables } from "@/types/supabase";

export async function searchUsers(query: string) {
  const { data, error } = await supabaseAdmin.rpc("search_users", { search_query: query });

  if (error) {
    console.error("Error searching users:", error);
    return [];
  }

  const users = data as { id: string; name: string; avatar: string }[];

  return users;
}

export async function searchSummaries(query: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("summaries")
    .select("*, authors(*)")
    .textSearch("title", query, {
      type: "websearch"
    });

  if (error) {
    console.error("Error searching summaries:", error);
    return [];
  }

  const summaries = data as (Tables<"summaries"> & { authors: Tables<"authors"> })[];

  return summaries;
}
