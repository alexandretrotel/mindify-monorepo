import Hero from "@/components/features/home/Hero";
import Faq from "@/components/features/home/Faq";
import Testimonials from "@/components/features/home/Testimonials";
import Pricing from "@/components/features/home/Pricing";
import React from "react";
import AppHeader from "@/components/global/AppHeader";
import Footer from "@/components/features/home/Footer";
import AccountDropdown from "@/components/global/AccountDropdown";
import type { UUID } from "crypto";
import { createClient } from "@/utils/supabase/server";
import type { UserMetadata } from "@supabase/supabase-js";

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;
  const userMetadata = user?.user_metadata as UserMetadata;

  const isConnected = !!user;

  return (
    <React.Fragment>
      <AppHeader>
        <AccountDropdown userId={userId} userMetadata={userMetadata} isConnected={isConnected} />
      </AppHeader>

      <main>
        <Hero />
        <Testimonials />
        <Pricing isConnected={isConnected} />
        <Faq />
      </main>

      <Footer />
    </React.Fragment>
  );
}
