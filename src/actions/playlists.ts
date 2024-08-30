"use server";
import { createClient } from "@/utils/supabase/server";
import "server-only";

export async function getAllRandomMindsPlaylists() {
  const supabase = createClient();

  const { data: randomMindsPlaylists, error } = await supabase
    .from("playlists")
    .select("*, minds(*)");

  if (error) {
    console.error(error);
    throw new Error("Une erreur s'est produite lors de la récupération des playlists.");
  }

  return randomMindsPlaylists;
}
