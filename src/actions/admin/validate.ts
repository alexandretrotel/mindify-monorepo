"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";

export async function rejectSummaryRequest(requestId: number) {
  const supabaseAdmin = createAdminClient();

  try {
    const { error } = await supabaseAdmin.from("summary_requests").delete().eq("id", requestId);

    if (error) {
      throw new Error("Error while rejecting summary request");
    }
  } catch (error) {
    console.error("Error while rejecting summary request", error);
    throw new Error("Error while rejecting summary request");
  }

  revalidatePath("/admin", "layout");
}

export async function approveSummaryRequest(requestId: number) {
  const supabaseAdmin = createAdminClient();

  try {
    const { error } = await supabaseAdmin
      .from("summary_requests")
      .update({ validated: true })
      .eq("id", requestId);

    if (error) {
      throw new Error("Error while approving summary request");
    }
  } catch (error) {
    console.error("Error while approving summary request", error);
    throw new Error("Error while approving summary request");
  }

  revalidatePath("/admin", "layout");
}
