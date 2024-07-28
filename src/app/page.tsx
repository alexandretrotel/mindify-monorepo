import Header from "@/src/app/components/Header";
import Hero from "@/src/app/components/Hero";
import Faq from "@/src/app/components/Faq";
import Testimonials from "@/src/app/components/Testimonials";
import Pricing from "@/src/app/components/Pricing";
import { createClient } from "@/utils/supabase/server";
import Footer from "@/src/app/components/Footer";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  const isUserConnected = !error && !!data?.user;

  if (!error && data?.user) {
    redirect("/app");
  }

  return (
    <>
      <Header isUserConnected={isUserConnected} />
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
