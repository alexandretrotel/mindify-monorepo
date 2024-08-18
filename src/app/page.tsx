import Hero from "@/app/components/Hero";
import Faq from "@/app/components/Faq";
import Testimonials from "@/app/components/Testimonials";
import Pricing from "@/app/components/Pricing";
import Footer from "@/app/components/Footer";
import React, { Suspense } from "react";
import Header from "@/app/components/client/Header";
import HeaderSkeleton from "@/app/components/skeleton/HeaderSkeleton";

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
