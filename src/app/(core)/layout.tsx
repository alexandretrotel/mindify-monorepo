import HeaderClient from "@/components/features/home/client/HeaderClient";
import Footer from "@/components/features/home/Footer";
import AccountDropdown from "@/components/global/AccountDropdown";
import AppHeader from "@/components/global/AppHeader";
import MobileNavbar from "@/components/global/MobileNavbar";
import { features } from "@/data/features";
import { createClient } from "@/utils/supabase/server";
import type { UserMetadata } from "@supabase/supabase-js";
import type { UUID } from "crypto";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;
  const userMetadata = user?.user_metadata as UserMetadata;

  const isConnected = !!user;

  return (
    <React.Fragment>
      {features.canLogIn ? (
        <AppHeader userId={userId} isConnected={isConnected} isNotTransparent>
          <AccountDropdown userId={userId} userMetadata={userMetadata} isConnected={isConnected} />
        </AppHeader>
      ) : (
        <HeaderClient />
      )}

      <main className="md:flew-row mx-auto flex w-full max-w-7xl flex-col justify-between p-4 py-12 pt-28 md:p-8 md:pt-32">
        {children}
      </main>

      <Footer userId={userId} isConnected={isConnected} />
      <MobileNavbar userId={userId} isConnected={isConnected} />
    </React.Fragment>
  );
};

export default Layout;
