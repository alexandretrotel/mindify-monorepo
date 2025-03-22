import { supabaseAdmin } from "@/utils/supabase";

export async function checkAuthorExists(author: string) {
  const { data: authorDataCheck, error: authorErrorCheck } = await supabaseAdmin
    .from("authors")
    .select("*")
    .eq("name", author)
    .maybeSingle();

  if (authorErrorCheck) {
    throw authorErrorCheck;
  }

  return {
    exists: !!authorDataCheck,
    data: authorDataCheck,
  };
}
