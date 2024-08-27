import React from "react";
import H3 from "@/components/typography/h3";
import { Carousel } from "@/components/ui/carousel";
import { Muted } from "@/components/typography/muted";
import { getMostSavedMinds, areMindsSaved } from "@/actions/minds";
import MindsClient from "@/components/global/MindsClient";
import { Tables } from "@/types/supabase";
import { UUID } from "crypto";

const PopularMinds = async ({
  userId,
  isConnected,
  userName
}: {
  userId: UUID;
  isConnected: boolean;
  userName: string;
}) => {
  const popularMinds = await getMostSavedMinds();

  const finalMinds = popularMinds?.slice(0, 10) as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[];

  const finalMindsIds = finalMinds?.map((mind) => mind?.id);

  let areMindsSavedArray = Array<boolean>(finalMindsIds.length).fill(false);
  if (isConnected) {
    areMindsSavedArray = await areMindsSaved(finalMindsIds, userId);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Les MINDS préférés des utilisateurs</H3>
        <Muted>Les idées clés qui vous serviront dans votre vie.</Muted>
      </div>

      <MindsClient
        minds={finalMinds}
        initialAreSaved={areMindsSavedArray}
        userId={userId}
        isConnected={isConnected}
        userName={userName}
      />
    </div>
  );
};

export default PopularMinds;
