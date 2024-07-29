import React from "react";
import LibraryClient from "@/app/app/(middleware)/components/tabs/client/LibraryClient";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import type { Source, Summaries, SummaryStatus } from "@/types/summary";
import type { Topics } from "@/types/topics";
import type { UserLibrary, UserReads } from "@/types/user";

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
  initialSource: Source | undefined;
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
  })) as Summaries;

  const { data: topicsData } = await supabase.from("topics").select("*");
  const topics = topicsData as Topics;

  const { data: userReadsData } = await supabase
    .from("user_reads")
    .select("*")
    .eq("user_id", userId);
  const userReads = userReadsData as UserReads;

  const { data: userLibraryData } = await supabase
    .from("user_library")
    .select("*")
    .eq("user_id", userId);
  const userLibrary = userLibraryData as UserLibrary;

  return (
    <LibraryClient
      summaries={summaries}
      topics={topics}
      userReads={userReads}
      userLibrary={userLibrary}
      initialSearch={initialSearch}
      initialTopic={initialTopic}
      initialSource={initialSource}
      initialStatus={initialStatus}
    />
  );
};

export default Library;
