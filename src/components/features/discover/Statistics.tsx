import React from "react";
import { createClient } from "@/utils/supabase/server";
import StatisticsClient from "@/components/features/discover/client/StatisticsClient";
import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import { getSummariesRepartition } from "@/actions/users";

const Statistics = async ({ userId }: { userId: UUID }) => {
  const supabase = createClient();

  const { data: userReadsData } = await supabase
    .from("read_summaries")
    .select("*, summaries(*)")
    .eq("user_id", userId);

  const userReads = userReadsData;
  const summaries = userReadsData?.map((item) => item?.summaries);

  const readingRepartitionData = await getSummariesRepartition(userId);
  const sortedRepartitionData = [...readingRepartitionData]?.sort(
    (a, b) => b.summaries - a.summaries
  );
  const readingRepartition = sortedRepartitionData?.slice(0, 6);

  return (
    <StatisticsClient
      userReads={userReads as Tables<"read_summaries">[]}
      summaries={summaries as Tables<"summaries">[]}
      readingRepartition={readingRepartition}
    />
  );
};

export default Statistics;
