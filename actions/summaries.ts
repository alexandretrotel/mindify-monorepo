"use server";
import "server-only";
import { UUID } from "crypto";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addSummaryToLibrary(userId: UUID, summaryId: number) {
  const supabase = createClient();

  const { error } = await supabase.from("user_library").insert({
    user_id: userId,
    summary_id: summaryId
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible d'ajouter le résumé à votre bibliothèque.");
  }

  revalidatePath("/(application)", "layout");
  return { error };
}

export async function removeSummaryFromLibrary(userId: UUID, summaryId: number) {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_library")
    .delete()
    .eq("user_id", userId)
    .eq("summary_id", summaryId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de supprimer le résumé de votre bibliothèque.");
  }

  revalidatePath("/(application)", "layout");
  return { error };
}

export async function markSummaryAsRead(userId: UUID, summaryId: number) {
  const supabase = createClient();

  const { error } = await supabase.from("user_reads").insert({
    user_id: userId,
    summary_id: summaryId
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de marquer le résumé comme lu.");
  }

  revalidatePath("/(application)", "layout");
  return { error };
}

export async function markSummaryAsUnread(userId: UUID, summaryId: number) {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_reads")
    .delete()
    .eq("user_id", userId)
    .eq("summary_id", summaryId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de marquer le résumé comme non lu.");
  }

  revalidatePath("/(application)", "layout");
  return { error };
}
