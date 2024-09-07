import Section from "@/components/global/Section";
import PulsatingButton from "@/components/magicui/pulsating-button";
import Link from "next/link";
import React from "react";

const calendlyLink: string = "https://calendly.com/akamirchau/30min";

const TakeACoffee = async () => {
  return (
    <Section id="take-a-coffee">
      <div className="flex flex-col items-center gap-4 md:gap-8">
        <h2 className="text-center text-2xl font-semibold md:text-4xl">On se prend un café ?</h2>

        <PulsatingButton
          pulseColor="#16a34a"
          className="w-full bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 md:w-fit"
        >
          <Link target="_blank" href={calendlyLink}>
            Appelle les fondateurs
          </Link>
        </PulsatingButton>
      </div>
    </Section>
  );
};

export default TakeACoffee;
