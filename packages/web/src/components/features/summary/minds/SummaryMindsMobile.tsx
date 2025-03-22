import { areMindsSaved, getMindsFromSummaryId } from "@/actions/minds.action";
import Mind from "@/components/global/Mind";
import type { Tables } from "@/types/supabase";
import { UUID } from "crypto";
import React from "react";

const SummaryMindsMobile = async ({
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
    <div className="grid grid-cols-1 gap-4">
      {summaryMinds.map((mind) => (
        <Mind
          key={mind.id}
          mind={mind}
          initialIsSaved={initialAreSaved[summaryMindsIds.indexOf(mind.id)]}
          userId={userId}
          isConnected={isConnected}
          userName={userName}
        />
      ))}
    </div>
  );
};

export default SummaryMindsMobile;
