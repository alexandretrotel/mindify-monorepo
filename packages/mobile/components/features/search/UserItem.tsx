import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import useUserLevel from "@/hooks/global/user/useUserLevel";
import useUserMetadata from "@/hooks/global/user/useUserMetadata";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { getAvatar } from "@/utils/avatars";
import { useRouter } from "expo-router";
import { UserIcon } from "lucide-react-native";
import React from "react";
import { View, Image } from "react-native";

export default function UserItem({
  user,
}: Readonly<{
  user: { id: string; name: string; avatar: string };
}>) {
  const userId = user.id;

  const { colorStyles, colors } = useTheme();
  const { userMetadata } = useUserMetadata(userId);
  const { xp } = useUserLevel(userId);
  const router = useRouter();

  let userAvatar = null;
  if (userMetadata) {
    userAvatar = getAvatar(userMetadata);
  }

  return (
    <HapticTouchableOpacity
      onPress={() => router.push(`/profile/${userId}`)}
      event="user_opened_profile"
      eventProps={{ user_id: userId }}>
      <View style={tw`flex w-full flex-row gap-2 items-center justify-between py-2`}>
        <View style={tw`flex flex-row gap-2 items-center`}>
          <View
            style={[
              colorStyles.bgMuted,
              tw`rounded-full overflow-hidden h-8 w-8 border flex items-center justify-center`,
            ]}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={tw`h-full w-full`} />
            ) : (
              <UserIcon size={16} color={colors.foreground} />
            )}
          </View>

          <ThemedText semibold style={[colorStyles.textForeground]}>
            {user.name}
          </ThemedText>
        </View>

        <ThemedText semibold style={[colorStyles.textForeground]}>
          {xp} XP
        </ThemedText>
      </View>
    </HapticTouchableOpacity>
  );
}
