"use server";
import "server-only";

import type { UUID } from "crypto";
import { createClient } from "@/utils/supabase/server";

export async function hasBeenOnboarded(): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;

  const { data, error } = await supabase
    .from("onboarding")
    .select("onboarded")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Une erreur est survenue lors de la récupération des données de l'onboarding.");
  }

  const onboarded = data?.onboarded ?? false;

  return onboarded;
}
