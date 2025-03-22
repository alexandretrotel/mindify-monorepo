import { View } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

export default function LearningCardHeader({
  authorName = "Auteur",
  summaryTitle = "Titre du résumé",
}: Readonly<{
  authorName: string;
  summaryTitle: string;
}>) {
  const { colorStyles } = useTheme();

  return (
    <View>
      <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>{authorName}</ThemedText>
      <ThemedText style={[colorStyles.textForeground, tw`text-base`]} semibold>
        {summaryTitle}
      </ThemedText>
    </View>
  );
}
