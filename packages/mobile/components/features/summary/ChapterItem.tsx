import ThemedText from "@/components/typography/ThemedText";
import { useSession } from "@/providers/SessionProvider";
import React from "react";
import { Switch, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import useUserSummaryState from "@/hooks/global/summaries/useUserSummaryState";
import tw from "@/lib/tailwind";
import Separator from "@/components/ui/Separator";
import { StarIcon } from "lucide-react-native";
import HapticPressable from "@/components/ui/haptic-buttons/HapticPressable";
import ThemedMarkdown from "@/components/ui/ThemedMarkdown";

export default function ChapterItem({
  title,
  text,
  index,
  totalLength,
  summaryId,
  topicId,
}: Readonly<{
  title: string;
  text: string;
  index: number;
  totalLength: number;
  summaryId: number;
  topicId: number;
}>) {
  const { userId } = useSession();
  const { colorStyles, colors } = useTheme();
  const { isRead, toggleRead, rating, handleRateSummary } = useUserSummaryState(
    userId,
    summaryId,
    topicId,
  );

  return (
    <View style={tw`flex-col gap-8`}>
      <View style={tw`flex-col gap-4`}>
        <View style={tw`flex-col w-full items-start gap-4`}>
          <View>
            <ThemedText style={[colorStyles.textPrimary, tw`text-sm`]}>
              Chapitre {index + 1}
            </ThemedText>
            <ThemedText semibold style={[tw`text-xl`, colorStyles.textForeground]}>
              {title}
            </ThemedText>
          </View>
        </View>
        <ThemedMarkdown>{text}</ThemedMarkdown>
      </View>

      {totalLength - 1 === index && (
        <View style={tw`flex-col gap-8`}>
          <Separator />

          <View style={tw`flex-col gap-8`}>
            <View style={tw`flex-row justify-between items-center gap-4`}>
              <ThemedText semibold>Note le résumé</ThemedText>
              <View style={tw`flex-row gap-4`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <HapticPressable
                    key={star}
                    event="user_rated_summary"
                    eventProps={{ rating: star }}
                    onPress={() => handleRateSummary(star)}>
                    <StarIcon
                      size={24}
                      color={colors.foreground}
                      fill={rating && rating >= star ? colors.foreground : "none"}
                    />
                  </HapticPressable>
                ))}
              </View>
            </View>

            <View style={tw`flex-row justify-between items-center gap-4`}>
              <ThemedText semibold>{isRead ? "Et voilà c'est lu" : "Pas encore lu"}</ThemedText>
              <Switch value={isRead} onValueChange={() => toggleRead()} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
