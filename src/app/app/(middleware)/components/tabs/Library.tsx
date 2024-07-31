import React from "react";
import LibraryClient from "@/app/app/(middleware)/components/tabs/client/LibraryClient";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import type { SummaryStatus } from "@/types/summary";
import type { Tables, Enums } from "@/types/supabase";

const Library = async ({
  userId,
  initialSearch,
  initialTopic,
  initialSource,
  initialStatus
}: {
  userId: UUID;
  initialSearch: string | undefined;
  initialTopic: string | undefined;
  initialSource: Enums<"source"> | undefined;
  initialStatus: SummaryStatus | undefined;
}) => {
  const supabase = createClient();

  const { data: summariesData } = await supabase
    .from("summaries")
    .select("*, authors(*), topics(*)");
  const summaries = summariesData?.map((summary) => ({
    ...summary,
    topic: summary.topics?.name as string,
    author_slug: summary.authors?.slug as string
  }));

  const { data: topicsData } = await supabase.from("topics").select("*");

  const { data: userReadsData } = await supabase
    .from("user_reads")
    .select("*")
    .eq("user_id", userId);

  const { data: userLibraryData } = await supabase
    .from("user_library")
    .select("*")
    .eq("user_id", userId);

  return (
    <LibraryClient
      summaries={summaries as (Tables<"summaries"> & { topic: string; author_slug: string })[]}
      topics={topicsData as Tables<"topics">[]}
      userReads={userReadsData as Tables<"user_reads">[]}
      userLibrary={userLibraryData as Tables<"user_library">[]}
      initialSearch={initialSearch}
      initialTopic={initialTopic}
      initialSource={initialSource}
      initialStatus={initialStatus}
    />
  );
};

export default Library;
