"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function addTopic(user_id: UUID, topic_id: number) {
  const supabase = await createClient();

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
  const supabase = await createClient();

  const { error } = await supabase.from("user_topics").delete().match({
    user_id,
    topic_id
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de supprimer l'intérêt.");
  }

  revalidatePath("/", "layout");
  return { message: "Intérêt supprimé avec succès." };
}

export async function getAdminTopicFromTopicSlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("topics")
    .select("*")
    .match({ slug })
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer l'intérêt.");
  }

  const topic = data as Tables<"topics">;

  return topic;
}
