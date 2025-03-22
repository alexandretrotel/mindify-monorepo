import MindifyAIClient from "@/components/features/mindify-ai/MindifyAIClient";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id;

  return <MindifyAIClient userId={userId} />;
}
