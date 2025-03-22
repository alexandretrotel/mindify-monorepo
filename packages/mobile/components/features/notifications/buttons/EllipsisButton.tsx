import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import { EllipsisIcon } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";
import { Animated, useWindowDimensions } from "react-native";

export default function EllipsisButton({
  isNotificationOpen,
  onPress,
}: Readonly<{
  isNotificationOpen: boolean;
  onPress: () => void;
}>) {
  const { colorStyles, colors } = useTheme();

  const actionWidth = useRef(new Animated.Value(96)).current;

  const dimensions = useWindowDimensions();
  const width = dimensions.width;

  useEffect(() => {
    Animated.timing(actionWidth, {
      toValue: isNotificationOpen ? width : 96,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [actionWidth, isNotificationOpen, width]);

  return (
    <Animated.View style={[{ width: actionWidth }]}>
      <HapticTouchableOpacity
        onPress={onPress}
        event="user_opened_notification_actions"
        style={[colorStyles.bgForeground, tw.style(`justify-center items-center flex h-full`)]}>
        <EllipsisIcon size={24} color={colors.background} />
      </HapticTouchableOpacity>
    </Animated.View>
  );
}
