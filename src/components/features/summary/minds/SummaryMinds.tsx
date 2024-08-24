import { areMindsSaved, getMindsFromSummaryId } from "@/actions/minds";
import MindsClient from "@/components/global/MindsClient";
import H2 from "@/components/typography/h2";
import { Carousel } from "@/components/ui/carousel";
import type { Tables } from "@/types/supabase";
import { UUID } from "crypto";
import React from "react";

const SummaryMinds = async ({
  summaryId,
  userId,
  isConnected
}: {
  summaryId: number;
  userId: UUID;
  isConnected: boolean;
}) => {
  const summaryMinds = (await getMindsFromSummaryId(summaryId)) as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  })[];

  if (!summaryMinds || summaryMinds.length === 0) {
    return null;
  }

  const summaryMindsIds = summaryMinds.map((mind) => mind.id);

  let initialAreSaved: boolean[] = summaryMindsIds?.map(() => false);
  if (isConnected) {
    initialAreSaved = await areMindsSaved(summaryMindsIds, userId);
  }

  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: "auto"
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-4">
        <H2>Les MINDS de ce résumé</H2>
        <MindsClient
          minds={summaryMinds}
          initialAreSaved={initialAreSaved}
          userId={userId}
          isConnected={isConnected}
        />
      </div>
    </Carousel>
  );
};

export default SummaryMinds;
