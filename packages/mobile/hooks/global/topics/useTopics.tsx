import { getSummariesCountByTopic, getTopics } from "@/actions/topics.action";
import type { Tables } from "@/types/supabase";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * Hook to get the topics
 *
 * @returns The topics
 */
export default function useTopics() {
  const [loading, setLoading] = useState<boolean>(true);
  const [topics, setTopics] = useState<Tables<"topics">[]>([]);
  const [summariesCountByTopic, setSummariesCountByTopic] = useState<Record<number, number>>({});
  const [loadingSummariesCountByTopic, setLoadingSummariesCountByTopic] = useState<boolean>(true);

  const orderedTopics = [...topics]?.sort((a, b) => a?.name?.localeCompare(b?.name));

  const fetchTopics = useCallback(async () => {
    try {
      const topics = await getTopics();
      const orderedTopics = [...topics]?.sort((a, b) => a?.name?.localeCompare(b?.name));
      setTopics(orderedTopics);
    } catch (error) {
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la récupération des thèmes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    const fetchSummariesCountByTopic = async () => {
      try {
        const summariesCount = await getSummariesCountByTopic();
        setSummariesCountByTopic(summariesCount);
      } catch (error) {
        console.error(error);
        Alert.alert("Une erreur est survenue lors de la récupération des thèmes");
      } finally {
        setLoadingSummariesCountByTopic(false);
      }
    };

    fetchSummariesCountByTopic();
  }, []);

  return {
    loading,
    topics,
    summariesCountByTopic,
    orderedTopics,
    fetchTopics,
    loadingSummariesCountByTopic,
  };
}
