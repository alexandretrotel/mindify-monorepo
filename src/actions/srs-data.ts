"use server";
import "server-only";

import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { createEmptyCard } from "ts-fsrs";

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

export async function initializeSrsData(
  userId: UUID,
  minds: (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[]
) {
  const supabase = createClient();

  for (const mind of minds) {
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
  }

  return true;
}
