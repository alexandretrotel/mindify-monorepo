import Hero from "@/app/components/Hero";
import Faq from "@/app/components/Faq";
import Testimonials from "@/app/components/Testimonials";
import Pricing from "@/app/components/Pricing";
import Footer from "@/app/components/Footer";
import { Suspense } from "react";
import Header from "@/app/components/Header";
import HeaderSkeleton from "@/app/components/skeleton/HeaderSkeleton";

export default async function Home() {
  return (
    <>
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
    </>
  );
}
