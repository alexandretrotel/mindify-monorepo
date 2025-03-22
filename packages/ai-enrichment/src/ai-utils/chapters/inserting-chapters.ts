import { supabaseAdmin } from "@/utils/supabase";

export async function insertingChapters(
  chapters: { title: string; text: string }[]
) {
  const { data: chaptersData, error: chaptersError } = await supabaseAdmin
    .from("chapters")
    .insert({
      titles: chapters.map((elt) => elt.title),
      texts: chapters.map((elt) => elt.text),
      mindify_ai: true,
    })
    .select()
    .maybeSingle();

  if (chaptersError) {
    throw chaptersError;
  }

  return chaptersData;
}
