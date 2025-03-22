import { Card } from "@/components/global/card/Card";
import ThemedText from "@/components/typography/ThemedText";
import useUserReadingStreak from "@/hooks/global/user/useUserReadingStreak";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { FlameIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

export default function ReadingStreakCard({ userId }: Readonly<{ userId: string | null }>) {
  const { colorStyles, colors } = useTheme();
  const { readingStreak, readingDays, daysInFrench } = useUserReadingStreak(userId);

  if (!userId) {
    return null;
  }

  return (
    <Card padding="medium" style={tw`w-full`}>
      <View style={tw`flex-row justify-between items-center`}>
        <ThemedText semibold style={[tw`text-base`, colorStyles.textCardForeground]}>
          Série de lecture
        </ThemedText>

        <View style={tw`flex-row items-center gap-0.5`}>
          <ThemedText semibold>{readingStreak}</ThemedText>
          <FlameIcon size={16} color={colors.primary} />
        </View>
      </View>

      <View style={tw`flex-row justify-between items-center`}>
        {daysInFrench.map((day, index) => {
          const isReadingDay = readingDays[index];

          return (
            <View key={index} style={tw`flex-col items-center gap-1`}>
              <ThemedText style={[tw`text-xs`, colorStyles.textCardForeground]}>
                {day.slice(0, 3) + "."}
              </ThemedText>
              <View
                style={[
                  isReadingDay ? colorStyles.bgPrimary : colorStyles.bgMuted,
                  isReadingDay ? null : colorStyles.border,
                  tw.style(`rounded-full w-8 h-8`, !isReadingDay && `border`),
                ]}
              />
            </View>
          );
        })}
      </View>
    </Card>
  );
}
