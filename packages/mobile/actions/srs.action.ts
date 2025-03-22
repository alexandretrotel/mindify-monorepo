"use server";

import { supabase } from "@/lib/supabase";
import { Card, createEmptyCard, FSRS, FSRSParameters, generatorParameters, Grade } from "ts-fsrs";

/**
 * Fetches the SRS data for a given mind and user.
 *
 * @param mindId The ID of the mind.
 * @param userId The ID of the user.
 * @param grade The grade of the review.
 * @returns {Promise<Card>} - A promise that resolves to the updated card.
 */
export async function updateSrsData(mindId: number, userId: string, grade: Grade) {
  const { data: srsData, error: srsError } = await supabase
    .from("srs_data")
    .select("*")
    .eq("mind_id", mindId)
    .eq("user_id", userId)
    .maybeSingle();

  const cardExists = srsData !== null;

  const emptyCard = createEmptyCard();

  if (!cardExists) {
    const { error: insertError } = await supabase.from("srs_data").insert({
      due: emptyCard.due.toISOString(),
      stability: emptyCard.stability,
      difficulty: emptyCard.difficulty,
      elapsed_days: emptyCard.elapsed_days,
      scheduled_days: emptyCard.scheduled_days,
      reps: emptyCard.reps,
      lapses: emptyCard.lapses,
      last_review: emptyCard.last_review?.toISOString(),
      state: emptyCard.state,
      user_id: userId,
      mind_id: mindId,
    });

    if (insertError) {
      console.error("Erreur lors de la création des données SRS", insertError);
      throw new Error("Erreur lors de la création des données SRS");
    }
  }

  if (srsError) {
    console.error("Erreur lors de la récupération des données SRS", srsError);
    throw new Error("Erreur lors de la récupération des données SRS");
  }

  const card: Card = {
    reps: srsData?.reps ?? emptyCard.reps,
    lapses: srsData?.lapses ?? emptyCard.lapses,
    stability: srsData?.stability ?? emptyCard.stability,
    difficulty: srsData?.difficulty ?? emptyCard.difficulty,
    elapsed_days: srsData?.elapsed_days ?? emptyCard.elapsed_days,
    scheduled_days: srsData?.scheduled_days ?? emptyCard.scheduled_days,
    state: srsData?.state ?? emptyCard.state,
    due: srsData?.due ? new Date(srsData.due) : emptyCard.due,
    last_review: srsData?.last_review ? new Date(srsData.last_review) : emptyCard.last_review,
  };

  const params: FSRSParameters = generatorParameters();
  const f: FSRS = new FSRS(params);
  const schedulingResult = f.next(cardExists ? card : emptyCard, new Date(), grade);
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
    mind_id: mindId,
  });

  if (updateError) {
    console.error("Erreur lors de la mise à jour des données SRS", updateError);
    throw new Error("Erreur lors de la mise à jour des données SRS");
  }

  return updatedCard;
}

/**
 * Fetches the SRS data for a given mind and user.
 *
 * @param totalTimeInMs The total time in milliseconds.
 * @param totalLength The total length of the learning session.
 * @param userId The ID of the user.
 * @returns {Promise<{ success: boolean }>} - A promise that resolves to an object with a success property.
 */
export async function postUserLearningSession(
  totalTimeInMs: number,
  totalLength: number,
  userId: string,
) {
  const { error } = await supabase.from("learning_sessions").insert({
    total_time: Math.max(0, totalTimeInMs),
    total_length: totalLength,
    user_id: userId,
  });

  if (error) {
    console.error("Erreur lors de la création de la session", error);
    throw new Error("Erreur lors de la création de la session");
  }

  return { success: true };
}
