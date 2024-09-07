import P from "@/components/typography/p";
import React, { Suspense } from "react";
import CardsMarquee from "@/components/features/home/CardsMarquee";
import CardsMarqueeSkeleton from "@/components/features/home/skeleton/CardsMarqueeSkeleton";
import Link from "next/link";
import PulsatingButton from "@/components/magicui/pulsating-button";
import H2 from "@/components/typography/h2";

const Features = async () => {
  return (
    <section id="features" className="relative isolate px-6 lg:px-8">
      <div className="mx-auto w-full py-16 sm:py-24 lg:py-28">
        <div className="flex flex-col gap-32 sm:gap-48 lg:gap-56">
          <div className="flex flex-col gap-16">
            <div className="mx-auto w-full max-w-5xl">
              <div className="flex justify-start">
                <div className="flex w-full flex-col">
                  <div className="flex flex-col gap-4 text-center md:text-left">
                    <H2>Accède à des idées qui changeront ta vie</H2>

                    <P>
                      On extrait pour toi les idées essentielles des livres, podcasts et vidéos.
                    </P>

                    <PulsatingButton
                      pulseColor="#16a34a"
                      className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 md:w-fit"
                    >
                      <Link href="/auth/signup">Accède à un savoir infini</Link>
                    </PulsatingButton>
                  </div>
                </div>
              </div>
            </div>

            <Suspense fallback={<CardsMarqueeSkeleton />}>
              <CardsMarquee />
            </Suspense>
          </div>

          <div className="mx-auto w-full max-w-5xl">
            <div className="grid gap-32 md:grid-cols-2 md:gap-8">
              <div className="order-2 md:order-1">d</div>

              <div className="order-1 flex w-full flex-col md:order-2">
                <div className="flex flex-col gap-4 text-center md:items-end md:text-right">
                  <H2>Apprends activement</H2>

                  <P>Ne te contente pas de lire, réfléchis afin de mieux comprendre.</P>

                  <PulsatingButton
                    pulseColor="#16a34a"
                    className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 md:w-fit"
                  >
                    <Link href="/auth/signup">Apprends tout de suite</Link>
                  </PulsatingButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-5xl">
            <div className="grid gap-32 md:grid-cols-2 md:gap-8">
              <div className="flex w-full flex-col">
                <div className="flex flex-col gap-4 text-center md:text-left">
                  <H2>Dans ta mémoire, à jamais</H2>

                  <P>
                    On te donne la réponse. On te rappelle quand la revoir et tu l&apos;apprends une
                    bonne fois pour toutes.
                  </P>

                  <PulsatingButton
                    pulseColor="#16a34a"
                    className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 md:w-fit"
                  >
                    <Link href="/auth/signup">Retiens dès maintenant</Link>
                  </PulsatingButton>
                </div>
              </div>

              <div className="flex items-center justify-end">d</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
