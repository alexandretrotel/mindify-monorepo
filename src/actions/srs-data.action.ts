"use server";
import "server-only";

import type { UUID } from "crypto";
import { createClient } from "@/utils/supabase/server";
import { FSRS, FSRSParameters, generatorParameters, type Grade } from "ts-fsrs";
import { revalidatePath } from "next/cache";

export async function updateSrsData(mindId: number, userId: UUID, grade: Grade) {
  const supabase = createClient();

  const { data: srsData, error: srsError } = await supabase
    .from("srs_data")
    .select("*")
    .eq("mind_id", mindId)
    .eq("user_id", userId)
    .single();

  if (srsError) {
    console.error("Erreur lors de la récupération des données SRS", srsError);
    throw new Error("Erreur lors de la récupération des données SRS");
  }

  const card = {
    ...srsData,
    due: srsData?.due ? new Date(srsData.due).toISOString() : new Date().toISOString(),
    last_review: srsData?.last_review ? new Date(srsData.last_review) : undefined
  };

  const params: FSRSParameters = generatorParameters();
  const f: FSRS = new FSRS(params);
  const schedulingResult = f.next(card, new Date(), grade);
  const updatedCard = schedulingResult.card;

  const { error: updateError } = await supabase.from("srs_data").upsert({
    due: updatedCard.due.toISOString(),
    stability: updatedCard.stability,
    difficulty: updatedCard.difficulty,
    elapsed_days: updatedCard.elapsed_days,
    scheduled_days: updatedCard.scheduled_days,
    reps: updatedCard.reps,
    lapses: updatedCard.lapses,
    last_review: updatedCard.last_review?.toISOString(),
    state: updatedCard.state,
    user_id: userId,
    mind_id: mindId
  });

  if (updateError) {
    console.error("Erreur lors de la mise à jour des données SRS", updateError);
    throw new Error("Erreur lors de la mise à jour des données SRS");
  }

  revalidatePath("/learn", "layout");
}
