import { useRouter } from "expo-router";
import type { Tables } from "@/types/supabase";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import { View, StyleSheet } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import { ArrowRightIcon } from "lucide-react-native";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

export default function TopicItem({
  topic,
  noClickable,
  summariesCount,
}: Readonly<{
  topic: Tables<"topics">;
  noClickable?: boolean;
  summariesCount?: number;
}>) {
  const { colorStyles, colors } = useTheme();
  const router = useRouter();

  if (noClickable) {
    return (
      <View style={tw`flex-row justify-between gap-4 items-center w-full`}>
        <View style={tw`flex-row items-center gap-2`}>
          <ThemedText>{topic.emoji}</ThemedText>
          <ThemedText style={colorStyles.textForeground} semibold>
            {topic.name} • {summariesCount}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <HapticTouchableOpacity
      style={styles.touchable}
      onPress={() => {
        if (summariesCount === 0) return;

        router.push(`/topic/${topic.id}`);
      }}
      event="user_opened_topic_screen"
      eventProps={{ topic_id: topic.id }}>
      <View style={tw`flex-row justify-between gap-4 items-center w-full`}>
        <View style={tw`flex-row items-center gap-2`}>
          <ThemedText>{topic.emoji}</ThemedText>
          <ThemedText style={colorStyles.textForeground} semibold>
            {topic.name}
          </ThemedText>
        </View>

        <View style={tw`pr-4 flex-row items-center gap-2`}>
          <View
            style={[tw`px-3 py-0.5 rounded-full border`, colorStyles.bgMuted, colorStyles.border]}>
            <ThemedText style={[tw`text-xs`, colorStyles.textMutedForeground]}>
              {summariesCount}
            </ThemedText>
          </View>
          <ArrowRightIcon size={20} color={colors.foreground} />
        </View>
      </View>
    </HapticTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
  },
});
