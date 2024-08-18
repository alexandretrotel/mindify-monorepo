import type { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";

export const supabaseDefaultClient = createServerClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
