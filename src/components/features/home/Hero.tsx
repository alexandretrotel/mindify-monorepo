import H1 from "@/components/typography/h1";
import P from "@/components/typography/p";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LandingFlashcard from "@/components/features/home/client/LandingFlashcard";

const Hero = async () => {
  return (
    <section id="home" className="flex h-screen items-center justify-center px-4">
      <div className="grid grid-cols-1 place-items-center justify-between gap-4 md:grid-cols-2 md:gap-16">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
          <div>
            <H1>Apprenez vite.</H1>
            <H1>Retenez mieux.</H1>
          </div>

          <P>
            Changez votre vie par la connaissance, transformez votre savoir en flashcard optimisées
            pour l&apos;apprentissage, suivez vos progrès.
          </P>

          <Button className="w-fit" asChild>
            <Link href="/auth/signup">Se lancer</Link>
          </Button>
        </div>

        <div className="hidden md:flex">
          <LandingFlashcard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
