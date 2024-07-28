import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/app/login");
  }

  return <>{children}</>;
};

export default Layout;
