import { useEffect, useState } from "react";
import type { Tables } from "@/types/supabase";
import { getSummariesByTopicId } from "@/actions/summaries.action";
import { Alert } from "react-native";

/**
 * Hook to get the summaries by topic id
 *
 * @param topicId The topic id
 * @returns The summaries and the loading state
 */
export default function useSummariesByTopicId(topicId: number) {
  const [summaries, setSummaries] = useState<
    (Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!topicId) {
        return;
      }

      setLoading(true);

      try {
        const summaries = await getSummariesByTopicId(topicId);
        setSummaries(summaries);
      } catch (error) {
        Alert.alert("Une erreur est survenue lors de la récupération des résumés");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [topicId]);

  return {
    summaries,
    loading,
  };
}
