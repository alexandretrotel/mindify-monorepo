import Discover from "@/components/features/discover/Discover";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const userId = data?.user?.id as UUID;

  return (
    <main>
      <Discover userId={userId} />
    </main>
  );
}
