import TopicLabel from "@/components/global/topics/TopicLabel";
import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import useUserSavedSummaries from "@/hooks/global/summaries/useUserSavedSummaries";
import useTopics from "@/hooks/global/topics/useTopics";
import tw from "@/lib/tailwind";
import { useSession } from "@/providers/SessionProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

type TopicsType = Awaited<ReturnType<typeof useTopics>>["topics"];

export default function Topics({ topics }: { topics: TopicsType }) {
  const { summariesCountByTopic } = useTopics();
  const { colorStyles } = useTheme();
  const { userId } = useSession();
  const router = useRouter();
  const { count } = useUserSavedSummaries(userId);

  const notEmptyTopics = topics?.filter((topic) => summariesCountByTopic[topic.id] > 0);

  if (!notEmptyTopics) {
    return null;
  }

  const topicsAndSaved = [
    ...(count > 0 ? [{ name: "Résumés enregistrés", emoji: "📚", id: "saved" }] : []),
    ...notEmptyTopics,
  ];

  if (!topicsAndSaved.length) {
    return null;
  }

  return (
    <View style={tw`flex-col gap-2 w-full`}>
      <ThemedText semibold style={[tw`text-lg px-4`, colorStyles.textForeground]}>
        Explorer les catégories
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`pl-2 pr-4`}>
        {topicsAndSaved.map((topic, index) => (
          <HapticTouchableOpacity
            key={index}
            event="user_clicked_on_topics_from_library"
            eventProps={{
              topic: topic.name,
              emoji: topic.emoji,
            }}
            onPress={() => {
              if (topic.id === "saved") {
                router.push("/saved-summaries");
                return;
              }

              router.push(`/topic/${topic.id}`);
            }}>
            <TopicLabel key={index} topic={topic.name} emoji={topic.emoji} />
          </HapticTouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
