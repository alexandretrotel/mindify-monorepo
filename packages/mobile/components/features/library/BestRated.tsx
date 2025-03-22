import SummaryCoverCard from "@/components/global/summaries/SummaryCoverCard";
import ThemedText from "@/components/typography/ThemedText";
import useSummaries from "@/hooks/global/summaries/useSummaries";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { FlatList, View } from "react-native";

type BestRatedSummariesType = Awaited<ReturnType<typeof useSummaries>>["summaries"];

export default function BestRated({
  bestRatedSummaries,
  loading,
}: {
  bestRatedSummaries: BestRatedSummariesType;
  loading: boolean;
}) {
  const { colorStyles } = useTheme();

  if (!bestRatedSummaries) {
    return null;
  }

  const slicedBestRatedSummaries = bestRatedSummaries.slice(0, 10);

  if (loading || !slicedBestRatedSummaries.length) {
    return null;
  }

  return (
    <View style={tw`flex-col gap-4 w-full`}>
      <View style={tw`px-4`}>
        <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
          Les mieux notés
        </ThemedText>
        <ThemedText style={[colorStyles.textMutedForeground]}>
          Les résumés les mieux notés par la communauté Mindify.
        </ThemedText>
      </View>

      <FlatList
        data={slicedBestRatedSummaries}
        renderItem={({ item }) => (
          <View style={tw`w-64 h-72`}>
            <SummaryCoverCard summary={item} horizontal />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`flex-row items-center gap-4 px-4`}
      />
    </View>
  );
}
