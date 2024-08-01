import React from "react";
import H3 from "@/components/typography/h3";
import { Carousel } from "@/components/ui/carousel";
import { Muted } from "@/components/typography/muted";
import { getAllMinds, getMostSavedMinds, isMindSaved } from "@/actions/minds";
import MindsClient from "@/components/global/MindsClient";
import { Tables } from "@/types/supabase";

const PopularMinds = async () => {
  const popularMinds = await getMostSavedMinds();
  const allMinds = await getAllMinds(10);

  let sortedAllMinds = [...allMinds];
  for (let i = allMinds?.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sortedAllMinds[i], sortedAllMinds[j]] = [sortedAllMinds[j], sortedAllMinds[i]];
  }

  const finalMinds = (popularMinds?.length >= 3 ? popularMinds : sortedAllMinds)?.slice(
    0,
    10
  ) as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[];

  const AreMindsSaved = await Promise.all(
    finalMinds?.map(async (mind) => {
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
          <H3>Les MINDS préférés des utilisateurs</H3>
          <Muted>Les idées clés qui vous serviront dans votre vie.</Muted>
        </div>

        <MindsClient minds={finalMinds} initialAreSaved={AreMindsSaved} />
      </div>
    </Carousel>
  );
};

export default PopularMinds;
