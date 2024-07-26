import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/");
  }

  return (
    <div className="md:flew-row mx-auto flex w-full max-w-7xl flex-col justify-between p-4 py-12 md:p-8">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
