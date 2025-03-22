import { supabaseAdmin } from "@/utils/supabase";

export async function deletingSummaryRequest(id: number) {
  const { error: deleteError } = await supabaseAdmin
    .from("summary_requests")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw deleteError;
  }
}
