"use server";
import "server-only";

import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { createEmptyCard, FSRS, FSRSParameters, generatorParameters, type Grade } from "ts-fsrs";
import { revalidatePath } from "next/cache";

export async function areMindsInitialized(
  userId: UUID,
  minds: (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[]
) {
  const supabase = createClient();

  const mindsIds = minds.map((mind) => mind.id);

  const { data: mindsInitialized, error } = await supabase
    .from("srs_data")
    .select("*")
    .eq("user_id", userId)
    .in("mind_id", mindsIds);

  if (error) {
    console.error("Erreur lors de la récupération des minds", error);
    throw new Error("Erreur lors de la récupération des minds");
  }

  const mindsNotInitialized = minds.filter((mind) => {
    const isMindInitialized = mindsInitialized.some(
      (mindInitialized) => mindInitialized.mind_id === mind.id
    );

    return !isMindInitialized;
  });

  return { initialized: mindsNotInitialized.length === 0, mindsNotInitialized };
}

let progressStore: { [key: string]: { current: number; total: number } } = {};

export async function initializeSrsData(
  userId: UUID,
  minds: (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[],
  progressId: string
) {
  const supabase = createClient();
  progressStore[progressId] = { current: 0, total: minds.length };

  for (let i = 0; i < minds.length; i++) {
    const mind = minds[i];
    const card = createEmptyCard(new Date());

    try {
      const { error } = await supabase.from("srs_data").insert({
        user_id: userId,
        mind_id: mind.id,
        elapsed_days: card.elapsed_days,
        scheduled_days: card.scheduled_days,
        reps: card.reps,
        lapses: card.lapses,
        state: card.state,
        due: card.due.toISOString(),
        stability: card.stability,
        difficulty: card.difficulty
      });

      if (error) {
        console.error("Erreur lors de l'initialisation des données SRS", error);
        continue;
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des données SRS", error);
      continue;
    }

    progressStore[progressId].current = i + 1;
  }

  revalidatePath("/learn", "layout");
  return true;
}

export async function getProgress(progressId: string) {
  return progressStore[progressId];
}

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

  const { error: updateError } = await supabase
    .from("srs_data")
    .update({
      due: updatedCard.due.toISOString(),
      stability: updatedCard.stability,
      difficulty: updatedCard.difficulty,
      elapsed_days: updatedCard.elapsed_days,
      scheduled_days: updatedCard.scheduled_days,
      reps: updatedCard.reps,
      lapses: updatedCard.lapses,
      last_review: updatedCard.last_review?.toISOString(),
      state: updatedCard.state
    })
    .eq("mind_id", mindId)
    .eq("user_id", userId);

  if (updateError) {
    console.error("Erreur lors de la mise à jour des données SRS", updateError);
    throw new Error("Erreur lors de la mise à jour des données SRS");
  }

  revalidatePath("/learn", "layout");
}
