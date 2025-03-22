import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import useUserTopics from "@/hooks/global/topics/useUserTopics";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import AnimateNumber from "react-native-animate-number";

export default function TopicsNumber({ userId }: Readonly<{ userId: string }>) {
  const { colorStyles } = useTheme();
  const router = useRouter();

  const { orderedTopics } = useUserTopics(userId);

  const handleModal = () => {
    if (orderedTopics.length === 0) return;

    router.push(`/user/topics/${userId}`);
  };

  return (
    <HapticTouchableOpacity
      onPress={handleModal}
      event="user_opened_topics_list_modal"
      eventProps={{ user_id: userId }}>
      <View style={tw`flex items-center justify-center text-center`}>
        <ThemedText semibold style={[tw`text-lg`, colorStyles.textCardForeground]}>
          <AnimateNumber value={orderedTopics?.length} countBy={1} />
        </ThemedText>
        <ThemedText style={colorStyles.textMutedForeground}>intérêts</ThemedText>
      </View>
    </HapticTouchableOpacity>
  );
}
