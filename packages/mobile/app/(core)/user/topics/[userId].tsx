import NoHeaderModalContainer from "@/components/containers/modals/expo/NoHeaderModalContainer";
import TopicLabel from "@/components/global/topics/TopicLabel";
import useProfileMetadata from "@/hooks/global/user/useProfileMetadata";
import useUserTopics from "@/hooks/global/topics/useUserTopics";
import { Stack, useGlobalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import tw from "@/lib/tailwind";

export default function TopicsModal() {
  const { userId } = useGlobalSearchParams<Readonly<{ userId: string }>>();

  const { username } = useProfileMetadata(userId);
  const { orderedTopics } = useUserTopics(userId);

  return (
    <NoHeaderModalContainer>
      <View style={tw`flex h-full px-4`}>
        <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
          <View style={styles.topicContainer}>
            {orderedTopics.map((topic) => (
              <TopicLabel key={topic.id} topic={topic.name} emoji={topic.emoji} />
            ))}
          </View>
        </ScrollView>
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
        title: `Intérêts de ${userName}`,
        headerTitle: `Intérêts de ${userName}`,
      }}
    />
  );
}

const styles = StyleSheet.create({
  topicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});
