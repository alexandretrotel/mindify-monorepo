import { getAllMinds } from "@/actions/minds.action";
import { assets } from "@/constants/assets";
import type { Tables } from "@/types/supabase";
import { Asset } from "expo-asset";
import { useCallback, useEffect, useState } from "react";

/**
 * A hook that fetches all minds.
 *
 * @returns The minds, loading state, refreshing state, and refresh handler
 */
export default function useFetchMinds() {
  const [minds, setMinds] = useState<
    (Tables<"minds"> & {
      summaries: Tables<"summaries"> & {
        topics: Tables<"topics">;
        authors: Tables<"authors">;
      };
      videoAsset: Asset;
    })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllMinds = useCallback(async () => {
    setLoading(true);
    try {
      const minds = await getAllMinds();
      const orderedRandomMinds = [...minds]?.sort(() => 0.5 - Math.random());
      const videoAssets = assets?.videos;

      const mindsWithVideos = orderedRandomMinds.map((mind, index) => ({
        ...mind,
        videoAsset: videoAssets?.[index % videoAssets?.length],
      }));

      setMinds(mindsWithVideos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllMinds();
  }, [fetchAllMinds]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllMinds().finally(() => setRefreshing(false));
  }, [fetchAllMinds]);

  return { minds, loading, refreshing, onRefresh };
}
