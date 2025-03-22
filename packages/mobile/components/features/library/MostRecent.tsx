import SummaryCoverCard from "@/components/global/summaries/SummaryCoverCard";
import ThemedText from "@/components/typography/ThemedText";
import useSummaries from "@/hooks/global/summaries/useSummaries";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { FlatList, View } from "react-native";

type SummariesType = Awaited<ReturnType<typeof useSummaries>>["summaries"];

export default function MostRecent({
  summaries,
  loading,
}: {
  summaries: SummariesType;
  loading: boolean;
}) {
  const { colorStyles } = useTheme();

  if (!summaries) {
    return null;
  }

  const mostRecentSummaries = [...summaries]
    .sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    ?.slice(0, 10);

  if (loading || !mostRecentSummaries.length) {
    return null;
  }

  return (
    <View style={tw`flex-col gap-4 w-full`}>
      <View style={tw`px-4`}>
        <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
          Les + récents
        </ThemedText>
        <ThemedText style={[colorStyles.textMutedForeground]}>
          Les derniers résumés ajoutés sur Mindify.
        </ThemedText>
      </View>

      <FlatList
        data={mostRecentSummaries}
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
