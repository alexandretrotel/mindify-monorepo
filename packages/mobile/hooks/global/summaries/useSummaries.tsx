import { getBestRatedSummaries, getSummaries } from "@/actions/summaries.action";
import { useCallback, useEffect, useState } from "react";

type BestRatedSummaries = Awaited<ReturnType<typeof getBestRatedSummaries>>;
type Summaries = Awaited<ReturnType<typeof getSummaries>>;

/**
 * Hook to get the summaries
 *
 * @returns The summaries and the loading state
 */
export default function useSummaries() {
  const [summaries, setSummaries] = useState<Summaries>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingBestRatedSummaries, setLoadingBestRatedSummaries] = useState<boolean>(true);
  const [bestRatedSummaries, setBestRatedSummaries] = useState<BestRatedSummaries>([]);

  const fetchSummaries = useCallback(async () => {
    try {
      const summaries = await getSummaries();
      const orderedSummaries = [...summaries].sort((a, b) => a.title.localeCompare(b.title));
      setSummaries(orderedSummaries);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries]);

  const fetchBestRatedSummaries = useCallback(async () => {
    try {
      const bestRatedSummaries = await getBestRatedSummaries();
      setBestRatedSummaries(bestRatedSummaries);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBestRatedSummaries(false);
    }
  }, []);

  useEffect(() => {
    fetchBestRatedSummaries();
  }, [fetchBestRatedSummaries]);

  return {
    summaries,
    loading,
    loadingBestRatedSummaries,
    bestRatedSummaries,
    fetchBestRatedSummaries,
    fetchSummaries,
  };
}
