import React from "react";
import { Button } from "@/components/ui/button";
import H1 from "@/components/typography/h1";
import TypographyP from "@/components/typography/p";
import Link from "next/link";

const Hero = () => {
  return (
    <section id="Accueil" className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <div className="flex flex-col gap-2">
            <H1>Prêt à changer ta vie?</H1>
            <TypographyP>
              Accède à toutes les connaissances qu&apos;on ne t&apos;apprend pas à l&apos;école pour
              devenir la personne dont tu rêves.
            </TypographyP>
          </div>
          <div className="mx-auto mt-10 flex items-center justify-center gap-x-6">
            <Button asChild>
              <Link href="/signup">Commencer gratuitement</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
