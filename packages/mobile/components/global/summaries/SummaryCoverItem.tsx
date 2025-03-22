import { getSummary } from "@/actions/summaries.action";
import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import useSearch from "@/hooks/features/search/useSearch";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "expo-router";
import { View, Image, StyleSheet } from "react-native";

type Summary =
  | Awaited<ReturnType<typeof getSummary>>
  | Awaited<ReturnType<typeof useSearch>>["searchResults"]["summaries"][number];

export default function SummaryCoverItem({
  summary,
}: Readonly<{
  summary: Summary;
}>) {
  const { colorStyles } = useTheme();
  const router = useRouter();

  return (
    <HapticTouchableOpacity
      onPress={() => router.push(`/summary/preview/${summary?.id}`)}
      event="user_opened_summary_preview"
      eventProps={{
        summary_id: summary?.id,
        summary_title: summary?.title,
        from: "summary_cover_item",
      }}>
      <View style={tw`flex gap-2 items-start py-2`}>
        <View style={tw`flex-row items-center gap-2`}>
          {summary?.image_url && (
            <View
              style={[
                styles.aspectRatio,
                colorStyles.bgMuted,
                tw`h-12 rounded-lg border overflow-hidden`,
              ]}>
              <Image source={{ uri: summary?.image_url }} style={tw`h-full w-full`} />
            </View>
          )}

          <View style={tw`flex w-full flex-shrink`}>
            <ThemedText
              semibold
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[tw`text-base`, colorStyles.textForeground]}>
              {summary?.title}
            </ThemedText>
            <ThemedText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[tw`text-sm`, colorStyles.textMutedForeground]}>
              de {summary?.authors?.name}
            </ThemedText>
          </View>
        </View>
      </View>
    </HapticTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  aspectRatio: {
    aspectRatio: 0.75,
  },
});
