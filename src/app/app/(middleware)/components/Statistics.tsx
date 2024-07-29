import React from "react";
import type { UserReads } from "@/types/user";
import type { Summaries } from "@/types/summary";
import { createClient } from "@/utils/supabase/server";
import StatisticsClient from "@/app/app/(middleware)/components/client/StatisticsClient";
import type { UUID } from "crypto";

export const revalidate = 0;

const Statistics = async ({ userId }: { userId: UUID }) => {
  const supabase = createClient();

  const { data: summariesData } = await supabase.from("summaries").select("*");
  const summaries: Summaries = summariesData as Summaries;

  const { data: userReadsData } = await supabase
    .from("user_reads")
    .select("*")
    .eq("user_id", userId);
  const userReads: UserReads = userReadsData as UserReads;

  return <StatisticsClient userReads={userReads} summaries={summaries} userId={userId} />;
};

export default Statistics;
