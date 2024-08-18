import { getMindsFromSummaryId, isMindSaved } from "@/actions/minds";
import MindsClient from "@/components/global/MindsClient";
import H2 from "@/components/typography/h2";
import { Carousel } from "@/components/ui/carousel";
import type { Tables } from "@/types/supabase";
import { UUID } from "crypto";
import React from "react";

const SummaryMinds = async ({ summaryId, userId }: { summaryId: number; userId: UUID }) => {
  const summaryMinds = (await getMindsFromSummaryId(summaryId)) as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  })[];

  if (!summaryMinds || summaryMinds.length === 0) {
    return null;
  }

  const initialAreSaved = await Promise.all(
    summaryMinds.map(async (mind) => {
      return await isMindSaved(mind?.id, userId).catch(() => false);
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
        <H2>Les MINDS de ce résumé</H2>
        <MindsClient minds={summaryMinds} initialAreSaved={initialAreSaved} userId={userId} />
      </div>
    </Carousel>
  );
};

export default SummaryMinds;
