import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Faq from "@/app/components/Faq";
import Testimonials from "@/app/components/Testimonials";
import Pricing from "@/app/components/Pricing";
import { createClient } from "@/utils/supabase/server";
import Footer from "@/app/components/Footer";
import type { Topics } from "@/types/topics/topics";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();

  const { data: topics } = await supabase.from("topics").select("*");
  const { data, error } = await supabase.auth.getUser();

  const isUserConnected = !error && !!data?.user;

  if (!error && data?.user) {
    redirect("/app");
  }

  return (
    <>
      <Header isUserConnected={isUserConnected} />
      <main className="flex-1">
        <Hero topics={topics as Topics} />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
