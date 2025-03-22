import React from "react";
import { View } from "react-native";
import { EyeIcon, BookmarkIcon, StarIcon } from "lucide-react-native";
import AnimateNumber from "react-native-animate-number";
import ThemedText from "@/components/typography/ThemedText";
import { useTheme } from "@/providers/ThemeProvider";
import Separator from "@/components/ui/Separator";
import tw from "@/lib/tailwind";

const SummaryStatistics = ({
  readSummaryCount,
  savedSummaryCount,
  formattedSummaryRating,
}: {
  readSummaryCount: number;
  savedSummaryCount: number;
  formattedSummaryRating: string;
}) => {
  const { colors } = useTheme();

  const summaryRating = parseFloat(formattedSummaryRating);

  return (
    <>
      <Separator style={tw`my-4`} />
      <View style={tw`px-4 flex-row justify-evenly w-full gap-4`}>
        <View style={tw`flex-row items-center gap-2`}>
          <EyeIcon size={24} color={colors.mutedForeground} />
          <ThemedText semibold style={{ color: colors.foreground }}>
            <AnimateNumber value={readSummaryCount} countBy={1} />
          </ThemedText>
        </View>

        <View style={tw`flex-row items-center gap-2`}>
          <BookmarkIcon size={24} color={colors.mutedForeground} />
          <ThemedText semibold style={{ color: colors.foreground }}>
            <AnimateNumber value={savedSummaryCount} countBy={1} />
          </ThemedText>
        </View>

        <View style={tw`flex-row items-center gap-2`}>
          <StarIcon size={24} color={colors.mutedForeground} />
          <ThemedText semibold style={{ color: colors.foreground }}>
            <AnimateNumber value={summaryRating} countBy={1} decimals={1} />
            /5
          </ThemedText>
        </View>
      </View>
    </>
  );
};

export default SummaryStatistics;
