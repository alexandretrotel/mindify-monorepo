import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import useUserReadSummariesCount from "@/hooks/global/summaries/useUserReadSummariesCount";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import AnimateNumber from "react-native-animate-number";

export default function ReadSummariesNumber({ userId }: Readonly<{ userId: string }>) {
  const { colorStyles } = useTheme();
  const router = useRouter();

  const { readSummariesCount } = useUserReadSummariesCount(userId);

  const handleModal = () => {
    if (readSummariesCount === 0) return;

    router.push(`/user/read-summaries/${userId}`);
  };

  return (
    <HapticTouchableOpacity
      onPress={handleModal}
      event="user_opened_read_summaries_list_modal"
      eventProps={{ user_id: userId }}>
      <View style={tw`flex items-center justify-center text-center`}>
        <ThemedText semibold style={[tw`text-lg`, colorStyles.textCardForeground]}>
          <AnimateNumber value={readSummariesCount} countBy={1} />
        </ThemedText>
        <ThemedText style={colorStyles.textMutedForeground}>résumés lus</ThemedText>
      </View>
    </HapticTouchableOpacity>
  );
}
