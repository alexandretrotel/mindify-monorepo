import Faq from "@/components/features/home/Faq";
import Footer from "@/components/features/home/Footer";
import Header from "@/components/features/home/Header";
import Hero from "@/components/features/home/Hero";
import Pricing from "@/components/features/home/Pricing";
import HeaderSkeleton from "@/components/features/home/skeleton/HeaderSkeleton";
import Testimonials from "@/components/features/home/Testimonials";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

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
        <Suspense fallback={<HeaderSkeleton />}>
          <Header />
        </Suspense>
        <main className="flex-1">
          <Hero />
          <Testimonials />
          <Pricing isConnected={isConnected} />
          <Faq />
        </main>
        <Footer userId={userId} isConnected={isConnected} />
      </React.Fragment>
    );
  }

  redirect("/discover");
};

export default Home;
