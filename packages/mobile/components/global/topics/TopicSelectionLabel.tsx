import { useTheme } from "@/providers/ThemeProvider";
import { View } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import tw from "@/lib/tailwind";

export default function TopicSelectionLabel({
  topic,
  emoji,
  isSelected,
}: Readonly<{
  topic: string;
  emoji: string | null;
  isSelected: boolean;
}>) {
  const { colorStyles } = useTheme();

  return (
    <View
      style={[
        colorStyles.bgCard,
        isSelected ? [colorStyles.borderPrimary] : [colorStyles.border],
        tw`px-4 py-2 my-2 mx-1 rounded-full border`,
      ]}>
      <View style={tw`flex-row items-center gap-2`}>
        {emoji && <ThemedText>{emoji}</ThemedText>}
        <ThemedText semibold style={[colorStyles.textForeground, tw`text-center`]}>
          {topic}
        </ThemedText>
      </View>
    </View>
  );
}
