import NavbarLayout from "@/components/Navbar";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    <>
      <NavbarLayout />
      <main className="flex min-h-screen items-center justify-center px-4 py-24 md:p-24">
        <Features />
      </main>
    </>
  );
}
