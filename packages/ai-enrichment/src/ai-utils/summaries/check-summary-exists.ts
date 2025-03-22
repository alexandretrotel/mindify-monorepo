import { supabaseAdmin } from "@/utils/supabase";

export async function checkSummaryExists(title: string) {
  const { data, error } = await supabaseAdmin
    .from("summaries")
    .select("*")
    .eq("title", title)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return {
    exists: !!data,
    data: data,
  };
}
