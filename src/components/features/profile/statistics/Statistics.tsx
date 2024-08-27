import React from "react";
import { createClient } from "@/utils/supabase/server";
import StatisticsClient from "@/components/features/profile/statistics/client/StatisticsClient";
import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";

const Statistics = async ({ userId }: { userId: UUID }) => {
  const supabase = createClient();

  const { data: userReadsData } = await supabase
    .from("read_summaries")
    .select("*, summaries(*, authors(*), topics(*))")
    .eq("user_id", userId);

  const userReads = userReadsData;
  const readSummaries = userReadsData?.map((item) => item?.summaries) as (Tables<"summaries"> & {
    authors: Tables<"authors">;
    topics: Tables<"topics">;
  })[];

  return (
    <StatisticsClient
      userReads={userReads as Tables<"read_summaries">[]}
      readSummaries={
        readSummaries as (Tables<"summaries"> & {
          topics: Tables<"topics">;
          authors: Tables<"authors">;
        })[]
      }
    />
  );
};

export default Statistics;
