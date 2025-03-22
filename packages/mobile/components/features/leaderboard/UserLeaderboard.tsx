import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import useUserMetadata from "@/hooks/global/user/useUserMetadata";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { getAvatar } from "@/utils/avatars";
import { useRouter } from "expo-router";
import { UserIcon } from "lucide-react-native";
import { View, Image } from "react-native";

export default function UserLeaderboard({
  userId,
  xp,
}: Readonly<{
  userId: string;
  xp: number;
}>) {
  const { colorStyles, colors } = useTheme();
  const { userMetadata } = useUserMetadata(userId);
  const router = useRouter();

  const avatar = getAvatar(userMetadata);
  const name = userMetadata?.name;

  if (!name || name === "") {
    return null;
  }

  return (
    <HapticTouchableOpacity
      onPress={() => router.push(`/(tabs)/profile/${userId}`)}
      event="user_opened_profile"
      eventProps={{ profile_id: userId }}>
      <View style={tw`flex-row items-center justify-between py-2`}>
        <View
          style={[
            colorStyles.bgMuted,
            tw`w-8 h-8 rounded-full border overflow-hidden flex items-center justify-center`,
          ]}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={tw`w-full h-full`} />
          ) : (
            <UserIcon size={16} color={colors.foreground} />
          )}
        </View>
        <ThemedText style={[colorStyles.textForeground, tw`flex-1 ml-2`]}>{name}</ThemedText>
        <ThemedText style={colorStyles.textForeground}>{`${xp} XP`}</ThemedText>
      </View>
    </HapticTouchableOpacity>
  );
}
