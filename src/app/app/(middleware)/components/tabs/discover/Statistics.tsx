import React from "react";
import { createClient } from "@/utils/supabase/server";
import StatisticsClient from "@/app/app/(middleware)/components/tabs/discover/client/StatisticsClient";
import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";

export const revalidate = 0;

const Statistics = async ({ userId }: { userId: UUID }) => {
  const supabase = createClient();

  const { data: userReadsData } = await supabase
    .from("read_summaries")
    .select("*, summaries(*)")
    .eq("user_id", userId);

  const userReads = userReadsData;
  const summaries = userReadsData?.map((item) => item?.summaries);

  return (
    <StatisticsClient
      userReads={userReads as Tables<"read_summaries">[]}
      summaries={summaries as Tables<"summaries">[]}
    />
  );
};

export default Statistics;
