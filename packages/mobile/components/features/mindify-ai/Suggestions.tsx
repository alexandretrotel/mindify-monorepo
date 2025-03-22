import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

export default function Suggestions({
  loading,
  suggestions,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  disabled,
}: {
  loading: boolean;
  suggestions: string[];
  inputMessage: string;
  setInputMessage: (s: string) => void;
  handleSendMessage: (s: string) => void;
  disabled: boolean;
}) {
  const [visible, setVisible] = useState(false);

  const { colorStyles } = useTheme();

  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (inputMessage.trim()) {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(10, { duration: 200 });
      setTimeout(() => {
        setVisible(false);
      }, 400);
    } else {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });
      setTimeout(() => {
        setVisible(true);
      }, 400);
    }
  }, [inputMessage, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (disabled) {
    return null;
  }

  if (!visible) {
    return null;
  }

  if (loading) {
    return (
      <View
        style={[
          tw`p-2 px-4 rounded-md flex justify-center items-center h-12 w-full`,
          colorStyles.bgBackground,
          colorStyles.border,
        ]}>
        <ThemedText style={colorStyles.textForeground}>Chargement des suggestions...</ThemedText>
      </View>
    );
  }

  if (!suggestions) {
    return;
  }

  return (
    <Animated.View style={animatedStyle}>
      <ScrollView
        contentContainerStyle={[
          tw`gap-2 items-center flex-row`,
          {
            backgroundColor: "transparent",
          },
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}>
        {suggestions?.map((suggestion, index) => {
          return (
            <HapticTouchableOpacity
              event="user_selected_suggestion"
              eventProps={{ suggestion }}
              key={index}
              onPress={async () => {
                setInputMessage(suggestion);
                await handleSendMessage(suggestion);
              }}>
              <View
                style={[
                  tw`p-2 px-4 rounded-md h-full flex justify-center items-center h-18 w-48`,
                  colorStyles.bgMuted,
                  colorStyles.border,
                ]}>
                <ThemedText>{suggestion}</ThemedText>
              </View>
            </HapticTouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}
