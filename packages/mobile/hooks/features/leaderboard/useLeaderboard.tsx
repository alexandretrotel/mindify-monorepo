import { getFriendsLeaderboard, getGlobalLeaderboard } from "@/actions/leaderboard.action";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * A hook that fetches the global and friends leaderboard.
 *
 * @param userId The user's ID.
 * @returns The global leaderboard, friends leaderboard, loading state, user XP, global user rank, friends user rank, global top rank percentage, friends top rank percentage, refresh handler, and refreshing state.
 */
export default function useLeaderboard(userId: string | null) {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<{
    length: number;
    leaderboard: {
      user_id: string;
      xp: number;
    }[];
  }>({
    length: 0,
    leaderboard: [],
  });
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<{
    length: number;
    leaderboard: {
      user_id: string;
      xp: number;
    }[];
  }>({
    length: 0,
    leaderboard: [],
  });
  const [loading, setLoading] = useState(true);
  const [userXP, setUserXP] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [globalUserRank, setGlobalUserRank] = useState<number | undefined>(undefined);
  const [friendsUserRank, setFriendsUserRank] = useState<number | undefined>(undefined);
  const [globalTopRankPercentage, setGlobalTopRankPercentage] = useState<number | undefined>(
    undefined,
  );
  const [friendsTopRankPercentage, setFriendsTopRankPercentage] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchGlobalLeaderboard = async () => {
      setLoading(true);

      try {
        const leaderboard = await getGlobalLeaderboard();
        setGlobalLeaderboard(leaderboard);
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Impossible de charger le leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalLeaderboard();
  }, [userId]);

  useEffect(() => {
    const fetchFriendsLeaderboard = async () => {
      if (!userId) {
        return;
      }

      setLoading(true);

      try {
        const leaderboard = await getFriendsLeaderboard(userId);
        setFriendsLeaderboard(leaderboard);
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Impossible de charger le leaderboard des amis.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsLeaderboard();
  }, [userId]);

  useEffect(() => {
    const userStats = globalLeaderboard?.leaderboard?.find((user) => user.user_id === userId);

    const userXP = userStats?.xp ?? 0;
    setUserXP(userXP);
  }, [globalLeaderboard?.leaderboard, userId]);

  const onRefresh = async () => {
    if (!userId) {
      return;
    }

    setRefreshing(true);

    try {
      await Promise.all([
        getGlobalLeaderboard().then(setGlobalLeaderboard),
        getFriendsLeaderboard(userId).then(setFriendsLeaderboard),
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de rafraîchir le leaderboard.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!globalLeaderboard || !friendsLeaderboard || !userId) {
      return;
    }

    const globalUserRankIndex = globalLeaderboard?.leaderboard?.findIndex(
      (user) => user.user_id === userId,
    );
    const globalUserRank = globalUserRankIndex !== -1 ? globalUserRankIndex + 1 : undefined;
    setGlobalUserRank(globalUserRank);

    const friendsUserRankIndex = friendsLeaderboard?.leaderboard?.findIndex(
      (user) => user.user_id === userId,
    );
    const friendsUserRank = friendsUserRankIndex !== -1 ? friendsUserRankIndex + 1 : undefined;
    setFriendsUserRank(friendsUserRank);

    const globalTopRankPercentage =
      globalUserRank !== undefined
        ? Math.max(1, Math.round((globalUserRank / globalLeaderboard?.length) * 100))
        : undefined;
    setGlobalTopRankPercentage(globalTopRankPercentage);

    const friendsTopRankPercentage =
      friendsUserRank !== undefined
        ? Math.max(1, Math.round((friendsUserRank / friendsLeaderboard?.length) * 100))
        : undefined;
    setFriendsTopRankPercentage(friendsTopRankPercentage);
  }, [globalLeaderboard, friendsLeaderboard, userId]);

  return {
    globalLeaderboard,
    friendsLeaderboard,
    loading,
    userXP,
    globalTopRankPercentage,
    friendsTopRankPercentage,
    globalUserRank,
    friendsUserRank,
    onRefresh,
    refreshing,
  };
}
