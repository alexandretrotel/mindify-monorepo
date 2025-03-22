import { useEffect, useState } from "react";
import { getSummary } from "@/actions/summaries.action";

type Summary = Awaited<ReturnType<typeof getSummary>>;

/**
 * Hook to get the summary
 *
 * @param summaryId The summary id
 * @returns The summary and the loading state
 */
const useSummary = (summaryId: string | number) => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const summaryIndex = typeof summaryId === "string" ? parseInt(summaryId, 10) : summaryId;

      if (!summaryId || isNaN(summaryIndex)) {
        return;
      }

      setLoading(true);

      try {
        if (summaryId) {
          const summaryData = await getSummary(summaryIndex);
          setSummary(summaryData);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [summaryId]);

  return { summary, loading };
};

export default useSummary;
