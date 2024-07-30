import type { Topic } from "@/types/topics";
import React from "react";
import type { Summaries } from "@/types/summary";
import SummariesByTopicClient from "@/app/app/(middleware)/topic/[slug]/components/client/SummariesByTopicClient";

const SummariesByTopic = async ({
  topic,
  summariesByTopic
}: {
  topic: Topic;
  summariesByTopic: Summaries;
}) => {
  return <SummariesByTopicClient topic={topic} summariesByTopic={summariesByTopic} />;
};

export default SummariesByTopic;
