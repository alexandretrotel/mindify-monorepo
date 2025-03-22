import { toSlug } from "@/utils/string";
import { supabaseAdmin } from "@/utils/supabase";

export async function insertingAuthor(author: string, description: string) {
  const authorSlug = toSlug(author);

  const { data: authorData, error: authorError } = await supabaseAdmin
    .from("authors")
    .insert({
      name: author,
      slug: authorSlug,
      description: description,
      mindify_ai: true,
    })
    .select()
    .maybeSingle();

  if (authorError) {
    throw authorError;
  }

  return authorData;
}
