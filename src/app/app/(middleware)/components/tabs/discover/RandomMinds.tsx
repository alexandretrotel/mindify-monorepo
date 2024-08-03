import React from "react";
import H3 from "@/components/typography/h3";
import { Carousel } from "@/components/ui/carousel";
import { Muted } from "@/components/typography/muted";
import { getRandomMinds, isMindSaved } from "@/actions/minds";
import MindsClient from "@/components/global/MindsClient";

const RandomMinds = async () => {
  const allRandomMinds = await getRandomMinds();
  const randomMinds = allRandomMinds?.slice(0, 10);

  const AreMindsSaved = await Promise.all(
    randomMinds?.map(async (mind) => {
      const isSaved = await isMindSaved(mind?.id).catch(() => false);
      return isSaved;
    })
  );

  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: "auto"
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <H3>Quelques MINDS au hasard</H3>
          <Muted>De quoi vous inspirer.</Muted>
        </div>

        <MindsClient minds={randomMinds} initialAreSaved={AreMindsSaved} />
      </div>
    </Carousel>
  );
};

export default RandomMinds;
