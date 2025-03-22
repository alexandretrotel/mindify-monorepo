import { supabaseAdmin } from "@/utils/supabase";

export async function fetchingSummaryRequests() {
  const { data, error } = await supabaseAdmin
    .from("summary_requests")
    .select("*")
    .eq("validated", true);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    console.warn("No summary requests found.");
  }

  return data;
}
