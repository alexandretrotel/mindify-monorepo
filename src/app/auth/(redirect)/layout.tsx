import React from "react";
import BackHome from "@/components/global/buttons/BackHome";
import { redirect } from "next/navigation";
import type { UUID } from "crypto";
import { createClient } from "@/utils/supabase/server";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;

  if (user) {
    redirect(`/profile/${userId}`);
  }

  return (
    <div className="relative flex h-screen items-center justify-center p-4">
      {children}

      <div className="absolute left-0 top-0 px-4 py-8 md:p-8">
        <BackHome />
      </div>
    </div>
  );
};

export default AuthLayout;
