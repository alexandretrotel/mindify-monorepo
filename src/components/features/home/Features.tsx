import P from "@/components/typography/p";
import React, { Suspense } from "react";
import CardsMarquee from "@/components/features/home/CardsMarquee";
import CardsMarqueeSkeleton from "@/components/features/home/skeleton/CardsMarqueeSkeleton";
import Link from "next/link";
import PulsatingButton from "@/components/magicui/pulsating-button";
import H2 from "@/components/typography/h2";
import { QuestionCardsStackClient } from "@/components/features/home/client/QuestionCardsStackClient";

const Features = async () => {
  return (
    <section id="features" className="relative isolate px-6 lg:px-8">
      <div className="mx-auto w-full py-16 sm:py-24 lg:py-28">
        <div className="flex flex-col gap-32 sm:gap-48 lg:gap-56">
          <div className="flex flex-col gap-16">
            <div className="mx-auto w-full max-w-5xl">
              <div className="flex justify-start">
                <div className="flex w-full flex-col">
                  <div className="flex md:w-1/2 flex-col gap-4 text-center md:text-left">
                    <H2>Nous sommes convaincus que la connaissance peut changer votre vie</H2>

                    <P>
                      Accède à l&apos;essence des livres, podcasts et vidéos cultes grâce à un
                      condensé des idées phares.
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
              <div className="order-2 md:order-1">
                <QuestionCardsStackClient />
              </div>

              <div className="order-1 flex w-full flex-col md:order-2">
                <div className="flex flex-col gap-4 text-center md:items-end md:text-right">
                  <H2>Nous croyons aux bénéfices d’un apprentissage actif</H2>

                  <P>
                    Réponds activement à des questions pour t&apos;imprégner entièrement des
                    enseignements.
                  </P>

                  <PulsatingButton
                    pulseColor="#16a34a"
                    className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 md:w-fit"
                  >
                    <Link href="/auth/signup">Commence à apprendre</Link>
                  </PulsatingButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-5xl">
            <div className="grid gap-32 md:grid-cols-2 md:gap-8">
              <div className="flex w-full flex-col">
                <div className="flex flex-col gap-4 text-center md:text-left">
                  <H2>Nous pensons que 1 idée retenue en vaut 10 survolées</H2>

                  <P>
                    Imprime dans ta mémoire tes idées préférées grâce à un système
                    d&apos;apprentissage optimisé.
                  </P>

                  <PulsatingButton
                    pulseColor="#16a34a"
                    className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 md:w-fit"
                  >
                    <Link href="/auth/signup">Retiens réellement</Link>
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
