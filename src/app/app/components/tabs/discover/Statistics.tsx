import React from "react";
import { createClient } from "@/utils/supabase/server";
import StatisticsClient from "@/app/app/components/tabs/discover/client/StatisticsClient";
import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import { getSummariesRepartition } from "@/actions/users";

export const revalidate = 0;

const Statistics = async () => {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id as UUID;

  const { data: userReadsData } = await supabase
    .from("read_summaries")
    .select("*, summaries(*)")
    .eq("user_id", userId);

  const userReads = userReadsData;
  const summaries = userReadsData?.map((item) => item?.summaries);

  const readingRepartitionData = await getSummariesRepartition(userId);

  return (
    <StatisticsClient
      userReads={userReads as Tables<"read_summaries">[]}
      summaries={summaries as Tables<"summaries">[]}
      readingRepartition={readingRepartitionData}
    />
  );
};

export default Statistics;
