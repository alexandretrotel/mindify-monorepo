"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { UUID } from "crypto";

export async function addTopic(user_id: UUID, topic_id: number) {
  const supabase = createClient();

  const { error } = await supabase.from("user_topics").insert({
    user_id,
    topic_id
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible d'ajouter l'intérêt'.");
  }

  revalidatePath("/", "layout");
  return { message: "Intérêt ajouté avec succès." };
}

export async function removeTopic(user_id: UUID, topic_id: number) {
  const supabase = createClient();

  console.log("user_id", user_id);
  console.log("topic_id", topic_id);

  const { error } = await supabase
    .from("user_topics")
    .delete()
    .eq("user_id", user_id)
    .eq("topic_id", topic_id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de supprimer l'intérêt.");
  }

  revalidatePath("/", "layout");
  return { message: "Intérêt supprimé avec succès." };
}
