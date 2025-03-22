import ThemedText from "@/components/typography/ThemedText";
import { useTheme } from "@/providers/ThemeProvider";
import { View, Image } from "react-native";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import Separator from "@/components/ui/Separator";
import { getFriendButtonVariant, getFriendStatusText } from "@/utils/friends";
import useProfileMetadata from "@/hooks/global/user/useProfileMetadata";
import useFriend from "@/hooks/global/friends/useFriendState";
import ProgressBar from "@/components/features/learning/ProgressBar";
import useUserLevel from "@/hooks/global/user/useUserLevel";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Card } from "@/components/global/card/Card";
import tw from "@/lib/tailwind";
import { PlusIcon, UserIcon } from "lucide-react-native";
import MissingName from "@/components/global/modals/MissingName";

export default function ProfileTab({
  isCurrentUser,
  profileId,
}: Readonly<{
  isCurrentUser: boolean;
  profileId: string;
}>) {
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);

  const { colorStyles, colors } = useTheme();
  const { username, avatarURL, biography } = useProfileMetadata(profileId);
  const { handleAskFriend, friendStatus } = useFriend(profileId);
  const { xp, level, xpForNextLevel, xpForCurrentLevel } = useUserLevel(profileId);
  const router = useRouter();

  const xpForThisLevel = Math.max(0, xpForNextLevel - xpForCurrentLevel);
  const xpAcquiredForThisLevel = Math.max(0, xp - xpForCurrentLevel);

  return (
    <>
      <Card padding="medium">
        <View style={tw`flex justify-center items-start gap-8 w-full`}>
          <View style={tw`flex-col gap-8`}>
            <View style={tw`flex-row gap-4`}>
              <View
                style={[
                  colorStyles.borderBackground,
                  colorStyles.bgMuted,
                  tw`flex overflow-hidden w-16 h-16 rounded-full border flex items-center justify-center`,
                ]}>
                {!!avatarURL ? (
                  <Image source={{ uri: avatarURL }} style={tw`aspect-square h-full w-full`} />
                ) : (
                  <UserIcon size={28} color={colors.foreground} />
                )}
              </View>

              <View style={tw`flex justify-center items-start`}>
                <ThemedText semibold style={[tw`text-lg`, colorStyles.textCardForeground]}>
                  {username}
                </ThemedText>

                <View style={tw`flex-row items-start`}>
                  <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
                    Niveau {level} / {xp} XP
                  </ThemedText>
                </View>
              </View>
            </View>

            <ThemedText style={colorStyles.textMutedForeground}>
              {biography || "Aucune biographie"}
            </ThemedText>
          </View>

          <View style={tw`flex-col gap-2 w-full`}>
            <View style={tw`flex-row justify-between items-center`}>
              <ThemedText semibold style={[tw`text-sm`, colorStyles.textCardForeground]}>
                Progression
              </ThemedText>
              <ThemedText semibold style={[tw`text-sm`, colorStyles.textCardForeground]}>
                {xpAcquiredForThisLevel}/{xpForThisLevel} XP
              </ThemedText>
            </View>
            <ProgressBar current={xpAcquiredForThisLevel} total={xpForThisLevel} />
          </View>

          {!isCurrentUser ? (
            <>
              <Separator />

              <View style={tw`w-full`}>
                <GenericHapticButton
                  onPress={() => handleAskFriend(profileId, friendStatus)}
                  variant={getFriendButtonVariant(friendStatus).variant}
                  textVariant={getFriendButtonVariant(friendStatus).textVariant}
                  style={tw`w-full`}
                  event="user_clicked_friend_button_from_profile"
                  eventProps={{ friend_status: friendStatus, profile_id: profileId }}>
                  {getFriendStatusText(friendStatus)}
                </GenericHapticButton>
              </View>
            </>
          ) : (
            <>
              <Separator />

              <View style={tw`w-full`}>
                <GenericHapticButton
                  onPress={() => {
                    if (username && username !== "") {
                      router.push("/add-friends");
                    } else {
                      setFriendsModalVisible(true);
                    }
                  }}
                  variant="black"
                  textVariant="textBlack"
                  style={tw`w-full`}
                  event="user_clicked_add_friends_from_profile"
                  icon={<PlusIcon size={24} color={colors.background} />}>
                  Ajouter des amis
                </GenericHapticButton>
              </View>
            </>
          )}
        </View>
      </Card>

      <MissingName
        friendsModalVisible={friendsModalVisible}
        setFriendsModalVisible={setFriendsModalVisible}
      />
    </>
  );
}
