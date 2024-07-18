import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Faq from "@/components/home/faq";
import Testimonials from "@/components/home/testimonials";
import Pricing from "@/components/home/pricing";
import { createClient } from "@/utils/supabase/server";
import Application from "@/components/application/application";
import Footer from "@/components/home/footer";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return (
      <>
        <Header />
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

  return (
    <Application userMetadata={data.user.user_metadata}>
      <></>
    </Application>
  );
}
