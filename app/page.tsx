import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Faq from "@/components/home/Faq";
import Testimonials from "@/components/home/Testimonials";
import Pricing from "@/components/home/Pricing";
import { createClient } from "@/utils/supabase/server";
import Footer from "@/components/home/Footer";
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
