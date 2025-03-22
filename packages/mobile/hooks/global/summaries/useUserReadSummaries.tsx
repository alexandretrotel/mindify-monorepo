import { getUserReadSummaries } from "@/actions/users.action";
import { useEffect, useState } from "react";

type Summaries = Awaited<ReturnType<typeof getUserReadSummaries>>;

/**
 * Hook to get the user read summaries
 *
 * @param userId The user id
 * @returns The summaries and the loading state
 */
export default function useUserReadSummaries(userId: string | null) {
  const [summaries, setSummaries] = useState<Summaries>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        const summaries = await getUserReadSummaries(userId);
        setSummaries(summaries);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [userId]);

  const orderedSummaries = [...summaries].sort((a, b) => a.title.localeCompare(b.title));

  const count = orderedSummaries?.length;

  return {
    summaries,
    orderedSummaries,
    loading,
    count,
  };
}
