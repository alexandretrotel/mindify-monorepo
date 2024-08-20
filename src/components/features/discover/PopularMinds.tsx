import React from "react";
import H3 from "@/components/typography/h3";
import { Carousel } from "@/components/ui/carousel";
import { Muted } from "@/components/typography/muted";
import { getMostSavedMinds, areMindsSaved } from "@/actions/minds";
import MindsClient from "@/components/global/MindsClient";
import { Tables } from "@/types/supabase";
import { UUID } from "crypto";

const PopularMinds = async ({ userId }: { userId: UUID }) => {
  const popularMinds = await getMostSavedMinds();

  const finalMinds = popularMinds?.slice(0, 10) as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[];

  const finalMindsIds = finalMinds?.map((mind) => mind?.id);
  const AreMindsSaved = await areMindsSaved(finalMindsIds, userId);

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

        <MindsClient minds={finalMinds} initialAreSaved={AreMindsSaved} userId={userId} />
      </div>
    </Carousel>
  );
};

export default PopularMinds;
