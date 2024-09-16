import HeaderClient from "@/components/features/home/client/HeaderClient";
import Faq from "@/components/features/home/Faq";
import Features from "@/components/features/home/Features";
import Footer from "@/components/features/home/Footer";
import Hero from "@/components/features/home/Hero";
import Pricing from "@/components/features/home/Pricing";
import TakeACoffee from "@/components/features/home/TakeACoffee";
import Testimonials from "@/components/features/home/Testimonials";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React from "react";

const Home = async () => {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;

  const isConnected = !!user;

  if (!isConnected) {
    return (
      <React.Fragment>
        <HeaderClient />

        <main className="flex-1">
          <Hero />
          <Features />
          <Testimonials />
          <Pricing isConnected={isConnected} />
          <Faq />
          <TakeACoffee />
        </main>

        <Footer userId={userId} isConnected={isConnected} />
      </React.Fragment>
    );
  }

  redirect("/library");
};

export default Home;
