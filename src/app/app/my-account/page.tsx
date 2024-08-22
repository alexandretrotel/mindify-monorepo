import Account from "@/components/global/Account";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React from "react";

const MyAccount = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const userId = data?.user?.id as UUID;
  const userMetadata = data?.user?.user_metadata;

  return <main></main>;
};

export default MyAccount;
