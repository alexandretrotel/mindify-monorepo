import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export default function ProgressBar({
  current,
  total,
  border,
}: Readonly<{
  current: number;
  total: number;
  border?: boolean;
}>) {
  const { colorStyles } = useTheme();

  const animatedValue = useRef(new Animated.Value(0)).current;

  const progress = !isNaN(current) && total > 0 ? (current / total) * 100 : 0;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, progress]);

  const widthInterpolate = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        colorStyles.bgMuted,
        colorStyles.border,
        tw.style(`relative grow overflow-hidden rounded-full h-3`, border && `border`),
      ]}>
      <Animated.View style={[colorStyles.bgPrimary, { width: widthInterpolate }, tw`h-full`]} />
    </View>
  );
}
