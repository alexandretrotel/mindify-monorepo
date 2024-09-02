import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as UUID;

  const { data, error } = await supabase.from("admins").select("*");

  if (error) {
    console.error("Error while fetching admins", error);
    throw new Error("Error while fetching admins");
  }

  const isAdmin = data?.find((admin) => admin?.user_id === userId);

  if (!isAdmin) {
    redirect("/auth/login");
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default Layout;
