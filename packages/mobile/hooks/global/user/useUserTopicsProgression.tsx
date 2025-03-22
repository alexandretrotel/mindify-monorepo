import { getUserTopicsProgression } from "@/actions/users.action";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch and manage user topics progression
 *
 * @param userId The user id to fetch topics progression from
 * @returns An object containing the user topics progression and some functions to manage it
 */
export default function useUserTopicsProgression(userId: string) {
  const [loading, setLoading] = useState(true);
  const [topicsProgression, setTopicsProgression] = useState<
    {
      topicId: number;
      count: number;
      total: number;
    }[]
  >([]);

  useEffect(() => {
    const fetchUserTopicsProgression = async () => {
      try {
        setLoading(true);

        const topicsProgression = await getUserTopicsProgression(userId);
        setTopicsProgression(topicsProgression);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTopicsProgression();
  }, [userId]);

  return { loading, topicsProgression };
}
