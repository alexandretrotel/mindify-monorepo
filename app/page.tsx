import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Faq from "@/components/home/faq";
import Testimonials from "@/components/home/testimonials";
import Pricing from "@/components/home/pricing";
import { createClient } from "@/utils/supabase/server";
import Footer from "@/components/home/footer";
import type { Topics } from "@/types/topics/topics";

export default async function Home() {
  const supabase = createClient();

  const { data: topics } = await supabase.from("topics").select("*");
  const { data, error } = await supabase.auth.getUser();

  const isUserConnected = !error && data?.user;

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
