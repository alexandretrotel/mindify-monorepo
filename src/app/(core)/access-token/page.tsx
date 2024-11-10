import { createClient } from "@/utils/supabase/server";
import React, { Suspense } from "react";

export default async function AccessTokenPage() {
  const supabase = await createClient();

  if (process.env.NODE_ENV === "production") {
    return <></>;
  }

  const {
    data: { session }
  } = await supabase.auth.getSession();

  return <>{session?.access_token}</>;
}
