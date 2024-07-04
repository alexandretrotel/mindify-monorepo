import Header from "@/components/home/header";
import Hero from "@/components/home/hero";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
      </main>
    </>
  );
}
