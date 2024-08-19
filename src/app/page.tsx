import Hero from "@/components/features/home/Hero";
import Faq from "@/components/features/home/Faq";
import Testimonials from "@/components/features/home/Testimonials";
import Pricing from "@/components/features/home/Pricing";
import Footer from "@/components/features/home/Footer";
import React, { Suspense } from "react";
import Header from "@/components/features/home/Header";
import HeaderSkeleton from "@/components/features/home/skeleton/HeaderSkeleton";

export default async function Home() {
  return (
    <React.Fragment>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main className="flex-1">
        <Hero />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </React.Fragment>
  );
}
