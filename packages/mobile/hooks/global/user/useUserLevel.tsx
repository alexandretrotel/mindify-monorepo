import { getUserLevel } from "@/actions/level.action";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to fetch and manage user level
 *
 * @param userId The user id to fetch level from
 * @returns An object containing the user level and some functions to manage it
 */
export default function useUserLevel(userId: string | null) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [xpForNextLevel, setXpForNextLevel] = useState(0);
  const [xpForCurrentLevel, setXpForCurrentLevel] = useState(0);
  const [progression, setProgression] = useState(0);

  const fetchUserLevel = useCallback(async () => {
    if (!userId) return;

    try {
      const { xp, level, xp_for_next_level, xp_of_current_level, progression } =
        await getUserLevel(userId);

      setXp(xp);
      setLevel(level);
      setXpForNextLevel(xp_for_next_level);
      setXpForCurrentLevel(xp_of_current_level);
      setProgression(progression);
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    const fetchInitUserLevel = async () => {
      setLoading(true);
      try {
        await fetchUserLevel();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitUserLevel();
  }, [fetchUserLevel, userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserLevel().then(() => setRefreshing(false));
  }, [fetchUserLevel]);

  return {
    xp,
    level,
    loading,
    onRefresh,
    refreshing,
    xpForNextLevel,
    xpForCurrentLevel,
    progression,
    fetchUserLevel,
  };
}
