import { areMindsSaved, getMindsFromSummaryId } from "@/actions/minds.action";
import MindsClient from "@/components/global/MindsClient";
import H2 from "@/components/typography/h2";
import type { Tables } from "@/types/supabase";
import { UUID } from "crypto";
import React from "react";

const SummaryMinds = async ({
  summaryId,
  userId,
  isConnected,
  userName
}: {
  summaryId: number;
  userId: UUID;
  isConnected: boolean;
  userName: string;
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
    <div className="flex flex-col gap-4">
      <H2>Les MINDS de ce résumé</H2>
      <MindsClient
        minds={summaryMinds}
        initialAreSaved={initialAreSaved}
        userId={userId}
        isConnected={isConnected}
        userName={userName}
      />
    </div>
  );
};

export default SummaryMinds;
