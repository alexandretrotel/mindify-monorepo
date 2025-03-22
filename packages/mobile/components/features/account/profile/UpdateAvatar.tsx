import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import { useEffect, useRef } from "react";
import { View, Image, Animated, Easing } from "react-native";
import { Loader2Icon, UserIcon } from "lucide-react-native";
import useUpdateAvatar from "@/hooks/features/account/profile/useUpdateAvatar";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

export default function UpdateAvatar() {
  const { avatar, uploading, pickImage } = useUpdateAvatar();
  const { colorStyles, colors } = useTheme();

  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={tw`flex-col gap-4`}>
      <View style={tw`flex-row items-center gap-2`}>
        <ThemedText semibold>Avatar</ThemedText>
        {uploading && (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Loader2Icon size={12} color={colors.foreground} />
          </Animated.View>
        )}
      </View>
      <View style={tw`flex-row items-center gap-4`}>
        <View
          style={[
            colorStyles.border,
            colorStyles.bgMuted,
            tw`w-12 h-12 border rounded-full overflow-hidden flex items-center justify-center`,
          ]}>
          {!!avatar ? (
            <Image source={{ uri: avatar }} style={tw`w-full h-full`} />
          ) : (
            <UserIcon size={24} color={colors.foreground} />
          )}
        </View>
        <HapticTouchableOpacity onPress={pickImage} event="user_update_avatar">
          <ThemedText>Modifier</ThemedText>
        </HapticTouchableOpacity>
      </View>
    </View>
  );
}
