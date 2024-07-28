import type { Topic } from "@/types/topics";
import React from "react";
import type { Authors, Summaries } from "@/types/summary";
import { createClient } from "@/utils/supabase/server";
import SummariesByCategoryClient from "@/app/app/(middleware)/topic/[slug]/components/client/SummariesByCategoryClient";

const SummariesByCategory = async ({ topic }: { topic: Topic }) => {
  const supabase = createClient();

  const { data: authorsData } = await supabase.from("authors").select("*");
  const authors = authorsData as Authors;

  const { data: summariesData } = await supabase
    .from("summaries")
    .select("*")
    .eq("topic_id", topic.id);

  const summaries = summariesData?.map((summary) => ({
    ...summary,
    topic: topic,
    author_slug: authors?.find((author) => author.id === summary.author_id)?.slug
  })) as Summaries;

  return <SummariesByCategoryClient topic={topic} summaries={summaries} />;
};

export default SummariesByCategory;
