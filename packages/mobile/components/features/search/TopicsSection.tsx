import React from "react";
import { FlatList, Platform, View } from "react-native";
import TopicItem from "@/components/global/topics/TopicItem";
import Separator from "@/components/ui/Separator";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import useTopics from "@/hooks/global/topics/useTopics";
import tw from "@/lib/tailwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TopicsSection() {
  const { loading, topics, summariesCountByTopic } = useTopics();
  const safeAreaInsets = useSafeAreaInsets();

  const paddingBottom =
    Platform.OS === "ios" ? safeAreaInsets.bottom + 32 : safeAreaInsets.bottom + 48;

  const filteredTopics = topics.filter((topic) => summariesCountByTopic[topic.id] > 0);

  if (loading) {
    return (
      <View style={tw`flex justify-center items-center h-full`}>
        <ThemedActivityIndicator />
      </View>
    );
  }

  return (
    <View style={tw`w-full h-full`}>
      <FlatList
        data={filteredTopics}
        renderItem={({ item }) => (
          <TopicItem topic={item} summariesCount={summariesCountByTopic[item.id] ?? 0} />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Separator style={tw`my-2`} />}
        contentContainerStyle={{ paddingTop: 16, paddingBottom }}
      />
    </View>
  );
}
