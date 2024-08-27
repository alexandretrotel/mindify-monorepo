import type { Enums, Tables } from "@/types/supabase";

export function getSummariesTopicRepartition(
  readSummaries: (Tables<"summaries"> & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
  })[]
) {
  const topics = readSummaries?.map((summary) => summary?.topics?.name);

  const topicsSet = new Set(topics);

  const topicsArray = Array.from(topicsSet);

  const topicsRepartition = topicsArray.map((topic) => {
    return {
      topic: topic as string,
      summaries: topics?.filter((topicName) => topicName === topic)?.length
    };
  });

  return topicsRepartition;
}

export function getSummariesTypeRepartition(
  readSummaries: (Tables<"summaries"> & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
  })[]
) {
  const types = readSummaries?.map((summary) => summary?.source_type);

  const typesSet = new Set(types);

  const typesArray = Array.from(typesSet);

  const typesRepartition = typesArray.map((source_type) => {
    return {
      source_type: source_type as Enums<"source">,
      summaries: types?.filter((typeName) => typeName === source_type)?.length
    };
  });

  return typesRepartition;
}
