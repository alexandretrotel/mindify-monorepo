import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Faq from "@/components/home/faq";
import Testimonials from "@/components/home/testimonials";
import Pricing from "@/components/home/pricing";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
    </>
  );
}
