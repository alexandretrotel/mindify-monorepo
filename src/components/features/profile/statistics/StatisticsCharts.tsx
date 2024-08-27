import React from "react";
import H3 from "@/components/typography/h3";
import type { Tables } from "@/types/supabase";
import AllTimeReadingTime from "@/components/features/profile/statistics/charts/AllTimeReadingTime";
import ReadTopicRepartition from "@/components/features/profile/statistics/charts/ReadTopicRepartition";
import WeeklyReads from "@/components/features/profile/statistics/charts/WeeklyReads";
import SummariesTypeRepartition from "@/components/features/profile/statistics/charts/SummariesTypeRepartition";

const StatisticsClient = async ({
  userReads,
  readSummaries
}: {
  userReads: Tables<"read_summaries">[];
  readSummaries: (Tables<"summaries"> & {
    authors: Tables<"authors">;
    topics: Tables<"topics">;
  })[];
}) => {
  const summariesRead = userReads?.length;

  if (!summariesRead) {
    return (
      <div className="flex h-72 flex-col items-center justify-center text-center">
        <H3>Pas de données de lecture</H3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <AllTimeReadingTime userReads={userReads} readSummaries={readSummaries} />
      <ReadTopicRepartition readSummaries={readSummaries} />
      <SummariesTypeRepartition readSummaries={readSummaries} />
      <WeeklyReads userReads={userReads} />
    </div>
  );
};

export default StatisticsClient;
