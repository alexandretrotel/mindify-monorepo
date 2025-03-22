import NoHeaderModalContainer from "@/components/containers/modals/expo/NoHeaderModalContainer";
import useProfileMetadata from "@/hooks/global/user/useProfileMetadata";
import useUserReadSummaries from "@/hooks/global/summaries/useUserReadSummaries";
import { Stack, useGlobalSearchParams } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import tw from "@/lib/tailwind";
import SummaryCoverCard from "@/components/global/summaries/SummaryCoverCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TopicsModal() {
  const { userId } = useGlobalSearchParams<Readonly<{ userId: string }>>();

  const { username } = useProfileMetadata(userId);
  const { orderedSummaries } = useUserReadSummaries(userId);
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <NoHeaderModalContainer noSafeArea>
      <View style={tw`flex h-full px-4`}>
        <FlatList
          data={orderedSummaries}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SummaryCoverCard summary={item} />}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: safeAreaInsets.bottom + 16 }}
          ItemSeparatorComponent={() => <View style={tw`my-2`} />}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <StackScreen userName={username} />
    </NoHeaderModalContainer>
  );
}

function StackScreen({ userName }: Readonly<{ userName: string }>) {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        title: `Résumés lus par ${userName}`,
        headerTitle: `Résumés lus par ${userName}`,
      }}
    />
  );
}
