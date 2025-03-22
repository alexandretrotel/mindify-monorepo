import React from "react";
import { ScrollView, View } from "react-native";
import { useSession } from "@/providers/SessionProvider";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { handleSeeOriginal, handleShareSummary } from "@/utils/summaries";
import Separator from "@/components/ui/Separator";
import NoHeaderModalContainer from "@/components/containers/modals/expo/NoHeaderModalContainer";
import SummaryHeader from "@/components/features/preview-summary/SummaryHeader";
import SummaryStatistics from "@/components/features/preview-summary/SummaryStatistics";
import useSummary from "@/hooks/global/summaries/useSummary";
import useSummaryStats from "@/hooks/features/summary/useSummaryStats";
import useUserSummaryState from "@/hooks/global/summaries/useUserSummaryState";
import SummaryFooter from "@/components/features/preview-summary/SummaryFooter";
import SummaryOverview from "@/components/features/preview-summary/SummaryOverview";
import SummaryData from "@/components/features/preview-summary/SummaryData";
import tw from "@/lib/tailwind";

export default function SummaryPreviewModal() {
  const { summaryId: summaryIndex } = useGlobalSearchParams<{
    summaryId: string;
  }>();
  const summaryId = Number(summaryIndex);

  const [readingBottomBar, setReadingBottomBar] = React.useState<number>(0);

  const { userId } = useSession();
  const { summary } = useSummary(summaryId);
  const { readSummaryCount, savedSummaryCount, formattedSummaryRating } =
    useSummaryStats(summaryId);
  const { isRead } = useUserSummaryState(userId, summaryId);

  const navigation = useNavigation();

  const handleBottomBarLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setReadingBottomBar(height);
  };

  if (!summary) {
    return null;
  }

  return (
    <NoHeaderModalContainer>
      <View style={[tw`relative h-full`]}>
        <SummaryHeader
          handleSeeOriginal={() => handleSeeOriginal(summary)}
          handleShare={() => handleShareSummary(summary)}
          handleClose={() => navigation.goBack()}
          summaryId={summaryId}
          summaryTitle={summary.title}
        />

        <ScrollView
          style={tw`flex flex-col h-full pt-8`}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "flex-start",
            paddingBottom: readingBottomBar + 32,
          }}>
          <SummaryOverview summary={summary} />

          <SummaryStatistics
            readSummaryCount={readSummaryCount}
            savedSummaryCount={savedSummaryCount}
            formattedSummaryRating={formattedSummaryRating}
          />

          <Separator style={tw`my-4`} />

          <SummaryData authorDescription={summary?.authors?.description} summaryId={summary?.id} />
        </ScrollView>
      </View>

      <SummaryFooter
        summaryId={summaryId}
        isRead={isRead}
        handleBottomBarLayout={handleBottomBarLayout}
      />
    </NoHeaderModalContainer>
  );
}
