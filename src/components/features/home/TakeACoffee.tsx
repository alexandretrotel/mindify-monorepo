import Section from "@/components/global/Section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const calendlyLink: string = "https://calendly.com/akamirchau/30min";

const TakeACoffee = async () => {
  return (
    <Section id="take-a-coffee">
      <div className="flex flex-col items-center gap-4 md:gap-8">
        <h2 className="text-center text-2xl font-semibold md:text-4xl">On se prend un café ?</h2>
        <Button size="lg" className="w-full px-12 text-lg md:w-fit" asChild>
          <Link target="_blank" href={calendlyLink}>
            Obtiens un appel exclusif avec les fondateurs
          </Link>
        </Button>
      </div>
    </Section>
  );
};

export default TakeACoffee;
