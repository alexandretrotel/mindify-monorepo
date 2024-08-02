import React from "react";
import LibraryClient from "@/app/app/(middleware)/components/tabs/client/LibraryClient";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import type { SummaryStatus } from "@/types/summary";
import type { Tables, Enums } from "@/types/supabase";

const Library = async ({
  initialSearch,
  initialTopic,
  initialSource,
  initialStatus
}: {
  initialSearch: string | undefined;
  initialTopic: string | undefined;
  initialSource: Enums<"source"> | undefined;
  initialStatus: SummaryStatus | undefined;
}) => {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id as UUID;

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
    .from("read_summaries")
    .select("*")
    .eq("user_id", userId);

  const { data: userLibraryData } = await supabase
    .from("saved_summaries")
    .select("*")
    .eq("user_id", userId);

  return (
    <LibraryClient
      summaries={
        summaries as (Tables<"summaries"> & { topic: string; author_slug: string } & {
          authors: Tables<"authors">;
          topics: Tables<"topics">;
        })[]
      }
      topics={topicsData as Tables<"topics">[]}
      userReads={userReadsData as Tables<"read_summaries">[]}
      userLibrary={userLibraryData as Tables<"saved_summaries">[]}
      initialSearch={initialSearch}
      initialTopic={initialTopic}
      initialSource={initialSource}
      initialStatus={initialStatus}
    />
  );
};

export default Library;
