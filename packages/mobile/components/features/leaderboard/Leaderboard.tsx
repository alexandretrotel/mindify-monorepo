import { Card } from "@/components/global/card/Card";
import Separator from "@/components/ui/Separator";
import ThemedText from "@/components/typography/ThemedText";
import { useSession } from "@/providers/SessionProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { getAvatar } from "@/utils/avatars";
import React, { JSXElementConstructor, ReactElement } from "react";
import { FlatList, Image, RefreshControlProps, View } from "react-native";
import UserLeaderboard from "./UserLeaderboard";
import tw from "@/lib/tailwind";
import { UserIcon } from "lucide-react-native";

export default function Leaderboard({
  leaderboard,
  userXP,
  topPercentage,
  userRank,
  refreshControl,
}: Readonly<{
  leaderboard: {
    length: number;
    leaderboard: {
      user_id: string;
      xp: number;
    }[];
  };
  userXP?: number;
  topPercentage?: number;
  userRank?: number;
  refreshControl: ReactElement<RefreshControlProps, string | JSXElementConstructor<any>>;
}>) {
  const { userMetadata } = useSession();
  const { colorStyles, colors } = useTheme();
  const userAvatar = getAvatar(userMetadata);

  const displayedLeaderboard = leaderboard.leaderboard;

  return (
    <Card style={tw`flex-1 overflow-hidden flex-col gap-0`}>
      <View style={tw`flex-col gap-4`}>
        <View
          style={[
            colorStyles.bgMuted,
            tw`w-12 h-12 overflow-hidden border rounded-full flex items-center justify-center`,
          ]}>
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={tw`w-full h-full`} />
          ) : (
            <UserIcon size={24} color={colors.foreground} />
          )}
        </View>

        <View style={tw`flex-row justify-between gap-4 items-center`}>
          <View style={tw`flex-col gap-2 items-start`}>
            <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
              Rang #{userRank}
            </ThemedText>
            <ThemedText style={colorStyles.textMutedForeground}>{userXP} XP</ThemedText>
          </View>

          <View style={tw`flex-col gap-2 items-end`}>
            <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
              Top {topPercentage}%
            </ThemedText>
            <ThemedText style={colorStyles.textMutedForeground}>
              parmi {leaderboard.length} utilisateurs
            </ThemedText>
          </View>
        </View>
      </View>

      <Separator style={tw`mt-6`} />

      <FlatList
        data={displayedLeaderboard}
        keyExtractor={(item) => item.user_id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return <UserLeaderboard userId={item.user_id} xp={item.xp} />;
        }}
        refreshControl={refreshControl}
        contentContainerStyle={tw`pt-4`}
      />
    </Card>
  );
}
