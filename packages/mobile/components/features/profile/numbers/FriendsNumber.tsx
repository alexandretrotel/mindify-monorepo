import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import useFriendsCount from "@/hooks/global/friends/useUserFriendsCount";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import AnimateNumber from "react-native-animate-number";

export default function FriendsNumber({ userId }: Readonly<{ userId: string }>) {
  const { colorStyles } = useTheme();
  const router = useRouter();

  const { friendsCount } = useFriendsCount(userId);

  const handleModal = () => {
    if (friendsCount === 0) return;

    router.push(`/user/friends/${userId}`);
  };

  return (
    <HapticTouchableOpacity
      onPress={handleModal}
      event="user_opened_friends_list_modal"
      eventProps={{ user_id: userId }}>
      <View style={tw`flex items-center justify-center text-center`}>
        <ThemedText semibold style={[tw`text-lg`, colorStyles.textCardForeground]}>
          <AnimateNumber value={friendsCount} countBy={1} />
        </ThemedText>
        <ThemedText style={colorStyles.textMutedForeground}>
          ami{friendsCount > 1 ? "s" : ""}
        </ThemedText>
      </View>
    </HapticTouchableOpacity>
  );
}
