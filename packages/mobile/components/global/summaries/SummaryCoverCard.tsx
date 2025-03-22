import { getBestRatedSummaries } from "@/actions/summaries.action";
import { getUserReadSummaries, getUserSavedSummaries } from "@/actions/users.action";
import { Card } from "@/components/global/card/Card";
import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import useSummaryStats from "@/hooks/features/summary/useSummaryStats";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { usePathname, useRouter } from "expo-router";
import { StarIcon } from "lucide-react-native";
import { Image, View } from "react-native";

type Summary =
  | Awaited<ReturnType<typeof getUserSavedSummaries>>[number]
  | Awaited<ReturnType<typeof getUserReadSummaries>>[number]
  | Awaited<ReturnType<typeof getBestRatedSummaries>>[number];

export default function SummaryCoverCard({
  summary,
  horizontal = false,
  isModal = false,
}: {
  summary: Summary;
  horizontal?: boolean;
  isModal?: boolean;
}) {
  const { colorStyles, colors } = useTheme();
  const { formattedSummaryRating } = useSummaryStats(summary.id);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <HapticTouchableOpacity
      onPress={() => {
        if (isModal) {
          router.replace(`/summary/${summary.id}`);
        } else {
          router.push(`/summary/preview/${summary.id}`);
        }
      }}
      event={`user_opened_summary_preview_from_${pathname}`}
      eventProps={{
        summary_id: summary.id,
      }}
      style={tw.style(horizontal && `flex-1`)}>
      <Card noPadding style={tw.style(horizontal && `flex-1`)}>
        <View
          style={[
            tw`w-auto border-b rounded-t-lg overflow-hidden`,
            colorStyles.bgMuted,
            colorStyles.border,
            tw.style(tw`h-32`),
          ]}>
          {summary.image_url && (
            <Image
              resizeMode="cover"
              source={{
                uri: summary.image_url,
              }}
              style={tw`w-full h-full`}
            />
          )}
        </View>

        <View style={tw.style(`flex-col justify-between gap-4 px-4 pb-4`, horizontal && `flex-1`)}>
          <View style={tw`flex-shrink flex-col`}>
            <ThemedText numberOfLines={1} style={colorStyles.textPrimary}>
              {summary.authors.name}
            </ThemedText>
            <ThemedText
              semibold
              numberOfLines={2}
              style={[colorStyles.textForeground, tw`text-lg`]}>
              {summary.title}
            </ThemedText>
            <ThemedText numberOfLines={1} style={colorStyles.textMutedForeground}>
              {summary.topics.name}
            </ThemedText>
          </View>

          <View style={tw`flex-row gap-1 items-center`}>
            <StarIcon size={20} color={colors.primary} fill={colors.primary} />
            <ThemedText semibold>{formattedSummaryRating}/5</ThemedText>
          </View>
        </View>
      </Card>
    </HapticTouchableOpacity>
  );
}
