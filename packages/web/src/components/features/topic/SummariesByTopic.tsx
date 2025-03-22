import React from "react";
import SummariesByTopicClient from "@/components/features/topic/client/SummariesByTopicClient";
import type { Tables } from "@/types/supabase";

const SummariesByTopic = async ({
  topic,
  summariesByTopic
}: {
  topic: Tables<"topics">;
  summariesByTopic: Tables<"summaries">[];
}) => {
  return (
    <SummariesByTopicClient
      topic={topic}
      summariesByTopic={
        summariesByTopic as (Tables<"summaries"> & { topic: string; author_slug: string } & {
          authors: Tables<"authors">;
          topics: Tables<"topics">;
        })[]
      }
    />
  );
};

export default SummariesByTopic;
