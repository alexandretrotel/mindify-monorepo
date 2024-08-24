import Discover from "@/components/features/discover/Discover";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;

  const isConnected = !!user;

  return (
    <main>
      <Discover userId={userId} isConnected={isConnected} />
    </main>
  );
}
