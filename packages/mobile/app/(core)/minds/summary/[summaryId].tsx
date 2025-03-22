import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, View } from "react-native";
import MindItem from "@/components/global/minds/MindItem";
import CenteredContainer from "@/components/containers/CenteredContainer";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import useMindsBySummaryId from "@/hooks/global/minds/useMindsBySummaryId";
import tw from "@/lib/tailwind";

export default function SummaryMinds() {
  const { summaryId } = useGlobalSearchParams<Readonly<{ summaryId: string }>>();

  const router = useRouter();
  const { loading, minds } = useMindsBySummaryId(parseInt(summaryId, 10));

  const summaryName = minds?.[0]?.summaries?.title ?? "Minds";

  if (!summaryId) {
    Alert.alert("Erreur", "Aucun résumé n'a été trouvé.");
    router.replace("/feed");
  }

  if (loading) {
    return (
      <CenteredContainer>
        <StackScreen summaryName={summaryName} />
        <ThemedActivityIndicator />
      </CenteredContainer>
    );
  }

  return (
    <HeaderPageContainer>
      <StackScreen summaryName={summaryName} />
      <FlatList
        data={minds}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item, index }) => {
          return <MindItem mind={item} />;
        }}
        ItemSeparatorComponent={() => <View style={tw`my-2`} />}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </HeaderPageContainer>
  );
}

function StackScreen({ summaryName }: Readonly<{ summaryName: string }>) {
  return (
    <Stack.Screen
      options={{
        title: summaryName,
        headerTitle: summaryName,
      }}
    />
  );
}
