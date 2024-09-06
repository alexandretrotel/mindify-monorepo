import P from "@/components/typography/p";
import Link from "next/link";
import LandingFlashcard from "@/components/features/home/client/LandingFlashcard";
import PulsatingButton from "@/components/magicui/pulsating-button";
import Pencil from "@/../public/landing/pencil.svg";
import Image from "next/image";

const Hero = async () => {
  return (
    <section
      id="home"
      className="relative flex h-screen min-h-[26rem] items-center justify-center overflow-hidden px-4"
    >
      <div className="relative z-10 grid grid-cols-1 place-items-center justify-between gap-4 md:grid-cols-2 md:gap-16">
        <div className="flex max-w-lg flex-col items-center gap-4 text-center md:gap-0">
          <div className="text-4xl font-semibold md:text-6xl">
            <h1>Apprenez vite.</h1>
            <h1>Retenez mieux.</h1>

            <div className="relative hidden h-[64px] w-full md:flex">
              <Image src={Pencil} alt="Pencil" fill={true} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <P>
              Changez votre vie par la connaissance, transformez votre savoir en flashcard
              optimisées pour l&apos;apprentissage, suivez vos progrès.
            </P>

            <PulsatingButton
              pulseColor="#16a34a"
              className="w-fit bg-primary px-12 text-lg hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
            >
              <Link href="/auth/signup">Commencer gratuitement</Link>
            </PulsatingButton>
          </div>
        </div>

        <div className="hidden w-full items-center justify-end md:flex">
          <LandingFlashcard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
