import { createClient } from "@/utils/supabase/server";
import { permanentRedirect, redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  const isUserConnected = !error && !!data?.user;

  if (isUserConnected) {
    redirect("/app");
  } else {
    permanentRedirect("/home");
  }
}
