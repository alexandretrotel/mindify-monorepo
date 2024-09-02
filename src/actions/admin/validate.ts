"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function rejectSummaryRequest(requestId: number) {
  const { error } = await supabaseAdmin.from("summary_requests").delete().eq("id", requestId);

  if (error) {
    console.error(error);
    throw new Error("Error while rejecting summary request");
  }

  revalidatePath("/(admin)", "layout");
}

export async function approveSummaryRequest(requestId: number) {
  const { error } = await supabaseAdmin
    .from("summary_requests")
    .update({ validated: true })
    .eq("id", requestId);

  if (error) {
    console.error(error);
    throw new Error("Error while approving summary request");
  }

  revalidatePath("/(admin)", "layout");
}
