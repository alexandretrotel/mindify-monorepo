"use server";
import { createClient } from "@/utils/supabase/server";
import "server-only";

export async function getAllRandomMindsPlaylists() {
  const supabase = await createClient();

  const { data: randomMindsPlaylists, error } = await supabase
    .from("playlists")
    .select("*, minds(*)")
    .eq("production", true);

  if (error) {
    console.error(error);
    throw new Error("Une erreur s'est produite lors de la récupération des playlists.");
  }

  return randomMindsPlaylists;
}

export async function getMindsFromPlaylistSlug(playlistSlug: string) {
  const supabase = await createClient();

  const { data: playlist, error } = await supabase
    .from("playlists")
    .select("*, minds(*, summaries(*, topics(*), authors(*)))")
    .match({ slug: playlistSlug, production: true })
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Une erreur s'est produite lors de la récupération des minds de la playlist.");
  }

  return playlist;
}
