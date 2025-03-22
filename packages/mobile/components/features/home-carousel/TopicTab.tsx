import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import type { Tables } from "@/types/supabase";

export default function TopicTab({
  topic,
  activeTopic,
  setActiveTopic,
}: Readonly<{
  topic: Tables<"topics">;
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
}>) {
  const { colorStyles } = useTheme();

  return (
    <HapticTouchableOpacity
      key={topic?.id}
      style={[
        activeTopic === topic?.slug ? colorStyles.bgPrimary : colorStyles.bgForeground,
        tw`px-4 py-2 rounded-lg mr-2`,
      ]}
      activeOpacity={1}
      event="user_selected_topic"
      eventProps={{ topic_id: topic?.id, topic_name: topic?.name }}
      onPress={() => {
        setActiveTopic(topic?.slug);
      }}>
      <ThemedText
        style={
          activeTopic === topic?.slug ? colorStyles.textBackground : colorStyles.textForeground
        }>
        {topic?.name}
      </ThemedText>
    </HapticTouchableOpacity>
  );
}
