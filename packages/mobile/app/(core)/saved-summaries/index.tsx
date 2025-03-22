import CenteredContainer from "@/components/containers/CenteredContainer";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import SummaryCoverCard from "@/components/global/summaries/SummaryCoverCard";
import ThemedText from "@/components/typography/ThemedText";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import useUserSavedSummaries from "@/hooks/global/summaries/useUserSavedSummaries";
import tw from "@/lib/tailwind";
import { useSession } from "@/providers/SessionProvider";
import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SavedSummaries() {
  const [refreshing, setRefreshing] = useState(false);

  const { userId } = useSession();
  const { summaries, loading, fetchSummaries } = useUserSavedSummaries(userId);
  const safeAreaInsets = useSafeAreaInsets();

  const handleRefreshing = async () => {
    setRefreshing(true);

    try {
      await fetchSummaries();
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

  if (!summaries || summaries?.length === 0) {
    return (
      <CenteredContainer>
        <ThemedText>Aucun résumé sauvegardé.</ThemedText>
      </CenteredContainer>
    );
  }

  return (
    <HeaderPageContainer>
      <View style={[tw`mx-auto w-full`]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={summaries}
          horizontal={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefreshing} />}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SummaryCoverCard summary={item} />}
          contentContainerStyle={{
            paddingVertical: 32,
            paddingBottom: safeAreaInsets.bottom + 32,
          }}
          ItemSeparatorComponent={() => <View style={tw`my-2`} />}
        />
      </View>
    </HeaderPageContainer>
  );
}
