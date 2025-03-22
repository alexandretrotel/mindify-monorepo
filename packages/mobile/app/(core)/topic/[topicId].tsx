import CenteredContainer from "@/components/containers/CenteredContainer";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import ThemedText from "@/components/typography/ThemedText";
import { useGlobalSearchParams, Stack } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import useSummariesByTopicId from "@/hooks/global/summaries/useSummariesByTopicId";
import useTopicName from "@/hooks/global/topics/useTopicName";
import SummaryCoverCard from "@/components/global/summaries/SummaryCoverCard";
import tw from "@/lib/tailwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TopicPage() {
  const { topicId } = useGlobalSearchParams<{ topicId: string }>();

  const { summaries, loading } = useSummariesByTopicId(parseInt(topicId, 10));
  const { topicName } = useTopicName(parseInt(topicId, 10));
  const safeAreaInsets = useSafeAreaInsets();

  if (loading) {
    return (
      <CenteredContainer>
        <StackScreen name={topicName} />
        <ThemedActivityIndicator />
      </CenteredContainer>
    );
  }

  if (!summaries || summaries?.length === 0) {
    return (
      <CenteredContainer>
        <StackScreen name={topicName} />
        <ThemedText>Aucun résumé pour le thème {topicName.toLowerCase()}.</ThemedText>
      </CenteredContainer>
    );
  }

  return (
    <HeaderPageContainer>
      <StackScreen name={topicName} />

      <View style={[tw`mx-auto w-full`]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={summaries}
          style={tw`w-full`}
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

function StackScreen({ name }: Readonly<{ name: string }>) {
  return (
    <Stack.Screen
      options={{
        title: name,
        headerTitle: name,
      }}
    />
  );
}
