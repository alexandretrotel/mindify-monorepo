import { getTopicName } from "@/actions/topics.action";
import { useEffect, useState } from "react";

/**
 * Hook to get the topic name
 *
 * @param topicId The topic id
 * @returns The topic name
 */
export default function useTopicName(topicId: number) {
  const [topicName, setTopicName] = useState<string>("Thème");

  useEffect(() => {
    const fetchTopicName = async () => {
      try {
        const topicName = await getTopicName(topicId);
        setTopicName(topicName);
      } catch (error) {
        console.error(error);
      }
    };

    if (topicId) {
      fetchTopicName();
    }
  }, [topicId]);

  return { topicName };
}
