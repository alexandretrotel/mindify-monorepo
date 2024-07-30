import React from "react";
import SummariesByTopicClient from "@/app/app/(middleware)/topic/[slug]/components/client/SummariesByTopicClient";
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
        summariesByTopic as (Tables<"summaries"> & { topic: string; author_slug: string })[]
      }
    />
  );
};

export default SummariesByTopic;
