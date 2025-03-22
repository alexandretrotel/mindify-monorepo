import { getUserTopics } from "@/actions/users.action";
import type { Tables } from "@/types/supabase";
import { useEffect, useState } from "react";

/**
 * Hook to get the user topics
 *
 * @param userId The user id
 * @returns The user topics
 */
export default function useUserTopics(userId: string) {
  const [topics, setTopics] = useState<Tables<"topics">[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topics = await getUserTopics(userId);
        setTopics(topics);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopics();
  }, [userId]);

  const orderedTopics = [...topics].sort((a, b) => a.name.localeCompare(b.name));

  return {
    topics,
    orderedTopics,
  };
}
