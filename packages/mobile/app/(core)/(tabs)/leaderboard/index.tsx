import CenteredContainer from "@/components/containers/CenteredContainer";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import TabLabelButton from "@/components/ui/tabs/TabLabelButton";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import ThemedText from "@/components/typography/ThemedText";
import useLeaderboard from "@/hooks/features/leaderboard/useLeaderboard";
import { useSession } from "@/providers/SessionProvider";
import { useState } from "react";
import { Platform, RefreshControl, View } from "react-native";
import Leaderboard from "@/components/features/leaderboard/Leaderboard";
import tw from "@/lib/tailwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LeaderboardTabs = "global" | "friends";

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<LeaderboardTabs>("global");

  const { userId } = useSession();
  const safeAreaInsets = useSafeAreaInsets();
  const {
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
  } = useLeaderboard(userId);

  const paddingBottom = Platform.OS === "ios" ? safeAreaInsets.bottom : safeAreaInsets.bottom + 16;

  const userRank = activeTab === "global" ? globalUserRank : friendsUserRank;
  const leaderboard = activeTab === "global" ? globalLeaderboard : friendsLeaderboard;
  const topRankPercentage =
    activeTab === "global" ? globalTopRankPercentage : friendsTopRankPercentage;

  if (loading) {
    return (
      <CenteredContainer>
        <ThemedActivityIndicator />
      </CenteredContainer>
    );
  }

  if (!globalLeaderboard || !friendsLeaderboard) {
    return (
      <CenteredContainer>
        <ThemedText semibold>Une erreur est survenue.</ThemedText>
      </CenteredContainer>
    );
  }

  return (
    <HeaderPageContainer>
      <View style={[tw`flex-col py-8 gap-4 h-full`, { paddingBottom }]}>
        <View style={tw`flex-row items-center gap-2`}>
          <TabLabelButton activeTab={activeTab === "global"} onClick={() => setActiveTab("global")}>
            Global
          </TabLabelButton>

          <TabLabelButton
            activeTab={activeTab === "friends"}
            onClick={() => setActiveTab("friends")}>
            Amis
          </TabLabelButton>
        </View>

        <Leaderboard
          leaderboard={leaderboard}
          userXP={userXP}
          topPercentage={topRankPercentage}
          userRank={userRank}
          refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
        />
      </View>
    </HeaderPageContainer>
  );
}
