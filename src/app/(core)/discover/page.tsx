import Discover from "@/components/features/discover/Discover";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;

  const isConnected = !!user;

  return (
    <Discover
      userId={userId}
      isConnected={isConnected}
      userName={user?.user_metadata?.name as string}
    />
  );
}
