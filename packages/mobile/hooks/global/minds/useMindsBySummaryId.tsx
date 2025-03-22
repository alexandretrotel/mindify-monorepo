import { getMindsBySummaryId } from "@/actions/minds.action";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

type Minds = Awaited<ReturnType<typeof getMindsBySummaryId>>;

/**
 * Hook to get the minds by summary id
 *
 * @param summaryId The id of the summary
 * @returns The minds and the loading state
 */
export default function useMindsBySummaryId(summaryId: number) {
  const [minds, setMinds] = useState<Minds>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMinds = async () => {
      setLoading(true);

      if (!summaryId) {
        return;
      }

      try {
        const minds = await getMindsBySummaryId(summaryId);
        setMinds(minds);
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    if (summaryId) {
      fetchMinds();
    }
  }, [summaryId]);

  return { minds, loading };
}
