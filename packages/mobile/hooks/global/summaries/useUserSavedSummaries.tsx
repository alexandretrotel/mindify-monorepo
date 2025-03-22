import { getUserSavedSummaries } from "@/actions/users.action";
import { useCallback, useEffect, useState } from "react";

type Summaries = Awaited<ReturnType<typeof getUserSavedSummaries>>;

/**
 * Hook to get the user saved summaries
 *
 * @param userId The user id
 * @returns The summaries and the loading state
 */
export default function useUserSavedSummaries(userId: string | null) {
  const [summaries, setSummaries] = useState<Summaries>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSummaries = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const summaries = await getUserSavedSummaries(userId);
      setSummaries(summaries);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries]);

  const orderedSummaries = [...summaries].sort((a, b) => a.title.localeCompare(b.title));
  const count = orderedSummaries?.length;

  return {
    summaries,
    orderedSummaries,
    loading,
    count,
    fetchSummaries,
  };
}
