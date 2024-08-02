import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Faq from "@/app/components/Faq";
import Testimonials from "@/app/components/Testimonials";
import Pricing from "@/app/components/Pricing";
import { createClient } from "@/utils/supabase/server";
import Footer from "@/app/components/Footer";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  const isUserConnected = !error && !!data?.user;

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
