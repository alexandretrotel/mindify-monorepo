import { useEffect, useMemo, useState } from "react";
import {
  getSummaryRating,
  getSummaryReadCount,
  getSummarySavedCount,
} from "@/actions/summaries.action";

/**
 * A hook that fetches the summary stats.
 *
 * @param summaryId The summary ID.
 * @returns The summary stats.
 */
const useSummaryStats = (summaryId: number) => {
  const [readSummaryCount, setReadSummaryCount] = useState(0);
  const [savedSummaryCount, setSavedSummaryCount] = useState(0);
  const [summaryRating, setSummaryRating] = useState(0);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const fetchSummaryStats = async () => {
      try {
        if (summaryId) {
          const readCount = await getSummaryReadCount(summaryId);
          const savedCount = await getSummarySavedCount(summaryId);
          const rating = await getSummaryRating(summaryId);

          setReadSummaryCount(readCount);
          setSavedSummaryCount(savedCount);
          setSummaryRating(rating);

          setShowStats(readCount > 0 || savedCount > 0 || rating > 0);
        }
      } catch (error) {
        console.error("Error fetching summary stats:", error);
      }
    };

    if (summaryId) {
      fetchSummaryStats();
    }
  }, [summaryId]);

  const formattedSummaryRating = useMemo(() => {
    if (summaryRating > 0 && !Number.isInteger(summaryRating)) {
      return summaryRating.toFixed(1);
    }
    return summaryRating.toString();
  }, [summaryRating]);

  return { readSummaryCount, savedSummaryCount, summaryRating, showStats, formattedSummaryRating };
};

export default useSummaryStats;
