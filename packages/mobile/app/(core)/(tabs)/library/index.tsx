import CenteredContainer from "@/components/containers/CenteredContainer";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import useSummaries from "@/hooks/global/summaries/useSummaries";
import tw from "@/lib/tailwind";
import React, { useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import Fuse from "fuse.js";
import ReadingStreakCard from "@/components/features/profile/cards/ReadingStreakCard";
import { useSession } from "@/providers/SessionProvider";
import Topics from "@/components/features/library/Topics";
import MostRecent from "@/components/features/library/MostRecent";
import BestRated from "@/components/features/library/BestRated";
import SummaryCoverCard from "@/components/global/summaries/SummaryCoverCard";
import Separator from "@/components/ui/Separator";
import ThemedText from "@/components/typography/ThemedText";
import useTopics from "@/hooks/global/topics/useTopics";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const {
    loading,
    summaries,
    loadingBestRatedSummaries,
    bestRatedSummaries,
    fetchSummaries,
    fetchBestRatedSummaries,
  } = useSummaries();
  const { userId } = useSession();
  const { topics, fetchTopics } = useTopics();

  const fuse = new Fuse(summaries, {
    keys: ["title", "authors.name"],
  });

  const searchResults = fuse.search(searchQuery);

  const searchResultsData = searchResults.map((result) => result.item);

  const handleRefreshing = async () => {
    try {
      setRefreshing(true);
      await fetchSummaries();
      await fetchBestRatedSummaries();
      await fetchTopics();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <CenteredContainer>
        <ThemedActivityIndicator />
      </CenteredContainer>
    );
  }

  return (
    <HeaderPageContainer noPadding>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefreshing} />}
        contentContainerStyle={tw`flex-col flex-1`}>
        <View style={tw`w-full px-4 pt-8`}>
          <ThemedTextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher du contenu"
            inputMode="search"
          />
        </View>

        <Separator style={tw`mt-8`} />

        {searchQuery.length > 0 ? (
          <>
            {searchResultsData.length === 0 ? (
              <View style={tw`flex-col items-center justify-center h-full pb-32`}>
                <ThemedText style={tw`text-center`}>Aucun résultat trouvé</ThemedText>
              </View>
            ) : (
              <View style={tw`flex-col flex-1 items-center justify-center`}>
                <View style={[tw`mx-auto w-full px-4`]}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={searchResultsData}
                    horizontal={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <SummaryCoverCard summary={item} />}
                    contentContainerStyle={{
                      paddingVertical: 32,
                    }}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View style={tw`my-2`} />}
                  />
                </View>
              </View>
            )}
          </>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`flex-col justify-center items-center w-full gap-4 py-8`}>
            <View style={tw`flex-col gap-8 w-full`}>
              <View style={tw`w-full px-4`}>
                <ReadingStreakCard userId={userId} />
              </View>
              <Topics topics={topics} />
              <BestRated
                bestRatedSummaries={bestRatedSummaries}
                loading={loadingBestRatedSummaries}
              />
              <MostRecent summaries={summaries} loading={loading} />
            </View>
          </ScrollView>
        )}
      </ScrollView>
    </HeaderPageContainer>
  );
}
