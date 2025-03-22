import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { View, RefreshControl, ScrollView, StyleSheet } from "react-native";
import React, { useCallback, useState } from "react";
import ThemedText from "@/components/typography/ThemedText";
import { useSession } from "@/providers/SessionProvider";
import { handleShareProfile } from "@/utils/profile";
import CenteredContainer from "@/components/containers/CenteredContainer";
import useProfileMetadata from "@/hooks/global/user/useProfileMetadata";
import { useTheme } from "@/providers/ThemeProvider";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import { CogIcon, ShareIcon } from "lucide-react-native";
import ProfileCard from "@/components/features/profile/cards/ProfileCard";
import useUserLevel from "@/hooks/global/user/useUserLevel";
import StatisticsCard from "@/components/features/profile/cards/StatisticsCard";
import TopicsProgressionCard from "@/components/features/profile/cards/TopicsProgressionCard";
import tw from "@/lib/tailwind";

export default function Profile() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [refreshing, setRefreshing] = useState(false);

  const { userId: initialUserId } = useSession();
  const { colors } = useTheme();

  const profileId = userId ?? initialUserId;
  const isCurrentUser = profileId === initialUserId;

  const { username, onRefresh: onRefreshMetadata, getUserMetadata } = useProfileMetadata(profileId);
  const { onRefresh: onRefreshLevel, fetchUserLevel } = useUserLevel(profileId);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    onRefreshMetadata();
    onRefreshLevel();
    setRefreshing(false);
  }, [onRefreshMetadata, onRefreshLevel]);

  const init = useCallback(() => {
    getUserMetadata();
    fetchUserLevel();
  }, [fetchUserLevel, getUserMetadata]);

  useFocusEffect(init);

  if (!profileId) {
    return (
      <CenteredContainer>
        <StackScreen username={username} profileId={profileId} />
        <ThemedText>Utilisateur introuvable</ThemedText>
      </CenteredContainer>
    );
  }

  return (
    <HeaderPageContainer>
      <StackScreen username={username} profileId={profileId} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            tintColor={colors.foreground}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
        horizontal={false}
        contentContainerStyle={{
          paddingVertical: 16,
          flexDirection: "column",
          gap: 16,
        }}>
        <ProfileCard isCurrentUser={isCurrentUser} profileId={profileId} />
        <StatisticsCard profileId={profileId} />
        <TopicsProgressionCard profileId={profileId} />
      </ScrollView>
    </HeaderPageContainer>
  );
}

function StackScreen({ username, profileId }: Readonly<{ username: string; profileId: string }>) {
  const { userId } = useSession();

  return (
    <Stack.Screen
      options={{
        headerTitle: username,
        headerRight: () => (
          <HeaderRightComponent userId={userId} profileId={profileId} username={username} />
        ),
      }}
    />
  );
}

function HeaderRightComponent({
  userId,
  profileId,
  username,
}: Readonly<{
  userId: string | null;
  profileId: string;
  username: string;
}>) {
  const isCurrentUser = userId === profileId;
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={tw`px-4 flex-row gap-6 items-center`}>
      <HapticTouchableOpacity
        onPress={() => handleShareProfile(username, profileId)}
        event="user_shared_profile"
        eventProps={{ profile_id: profileId, username }}>
        <ShareIcon size={24} color={colors.foreground} />
      </HapticTouchableOpacity>

      {isCurrentUser && (
        <HapticTouchableOpacity
          event="user_opened_settings"
          eventProps={{ profile_id: profileId }}
          onPress={() => router.push("/settings")}>
          <CogIcon size={24} color={colors.foreground} />
        </HapticTouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
