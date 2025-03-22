"use server";

import { supabase } from "@/lib/supabase";

/**
 * Save the expo push token for a user
 *
 * @param userId The user id
 * @param expoPushToken The expo push token
 * @returns {Promise<{ success: boolean }>} The result of the operation
 */
export async function saveTokenForUser(userId: string, expoPushToken: string) {
  const { error } = await supabase.from("push_notification_tokens").insert({
    user_id: userId,
    expo_push_token: expoPushToken,
  });

  if (error) {
    console.error(error);
    throw Error(
      "Une erreur s'est produite lors de l'enregistrement du token pour les notifications push",
    );
  }

  return { success: true };
}
