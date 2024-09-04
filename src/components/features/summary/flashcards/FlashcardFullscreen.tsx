import React from "react";
import FlashcardFullscreenClient from "@/components/features/summary/flashcards/client/FlashcardFullscreenClient";
import type { Tables } from "@/types/supabase";
import { areMindsSaved, getMindsFromSummaryId } from "@/actions/minds";
import type { UUID } from "crypto";

const FlashcardFullscreen = async ({
  summaryId,
  isConnected,
  userId,
  userName
}: {
  summaryId: number;
  isConnected: boolean;
  userId: UUID;
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
    <FlashcardFullscreenClient
      minds={summaryMinds}
      initialAreSaved={initialAreSaved}
      userId={userId}
      userName={userName}
      isConnected={isConnected}
    />
  );
};

export default FlashcardFullscreen;
