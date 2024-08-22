import AccountDropdown from "@/components/global/AccountDropdown";
import AppHeader from "@/components/global/AppHeader";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const userId = data?.user?.id as UUID;
  const userMetadata = data?.user?.user_metadata;

  return (
    <React.Fragment>
      <AppHeader>
        <AccountDropdown userId={userId} userMetadata={userMetadata} />
      </AppHeader>

      <div className="md:flew-row mx-auto flex w-full max-w-7xl flex-col justify-between p-4 py-12 pt-28 md:p-8 md:pt-32">
        {children}
      </div>
    </React.Fragment>
  );
};

export default Layout;
