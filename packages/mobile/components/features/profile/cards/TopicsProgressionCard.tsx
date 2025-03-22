import { Card } from "@/components/global/card/Card";
import ProgressBar from "@/components/features/learning/ProgressBar";
import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import useTopics from "@/hooks/global/topics/useTopics";
import useUserTopicsProgression from "@/hooks/global/user/useUserTopicsProgression";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "expo-router";
import { ChevronRightIcon } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import tw from "@/lib/tailwind";

export default function TopicsProgressionCard({ profileId }: Readonly<{ profileId: string }>) {
  const [showAll, setShowAll] = useState(false);

  const { topics } = useTopics();
  const { colors, colorStyles } = useTheme();
  const { topicsProgression } = useUserTopicsProgression(profileId);
  const router = useRouter();

  const filteredTopics = useMemo(
    () =>
      [...topics].filter((topic) => {
        const total = topicsProgression.find((tp) => tp.topicId === topic.id)?.total ?? 0;

        return total > 0;
      }),
    [topics, topicsProgression],
  );

  const orderedProgressionTopics = useMemo(
    () =>
      [...filteredTopics].sort((a, b) => {
        const aCount = topicsProgression.find((tp) => tp.topicId === a.id)?.count ?? 0;
        const aTotal = topicsProgression.find((tp) => tp.topicId === a.id)?.total ?? 0;
        const bCount = topicsProgression.find((tp) => tp.topicId === b.id)?.count ?? 0;
        const bTotal = topicsProgression.find((tp) => tp.topicId === b.id)?.total ?? 0;

        const aProgression = aTotal !== 0 ? (aCount / aTotal) * 100 : 0;
        const bProgression = bTotal !== 0 ? (bCount / bTotal) * 100 : 0;

        if (bProgression !== aProgression) {
          return bProgression - aProgression;
        } else {
          return a.name.localeCompare(b.name);
        }
      }),
    [filteredTopics, topicsProgression],
  );

  const displayedTopics = useMemo(
    () => (showAll ? [...orderedProgressionTopics] : [...orderedProgressionTopics].slice(0, 3)),
    [orderedProgressionTopics, showAll],
  );

  const showDisplayedTopics = displayedTopics.length > 0;

  return (
    <Card padding="medium">
      <View style={tw`flex-row justify-between items-center`}>
        <ThemedText semibold style={[tw`text-base`, colorStyles.textCardForeground]}>
          Progression des thèmes
        </ThemedText>
      </View>

      {showDisplayedTopics && (
        <View style={tw`flex-col gap-8`}>
          {displayedTopics.map((topic) => {
            const current = topicsProgression.find((tp) => tp.topicId === topic.id)?.count ?? 0;
            const total = topicsProgression.find((tp) => tp.topicId === topic.id)?.total ?? 0;
            const percentage = total !== 0 ? (current / total) * 100 : 0;
            const progression = Math.round(percentage);

            return (
              <View key={topic.id} style={tw`flex-col gap-2`}>
                <View style={tw`flex-row justify-between items-center`}>
                  <HapticTouchableOpacity
                    onPress={() => router.push(`/topic/${topic.id}`)}
                    event="user_viewed_topic"
                    eventProps={{ topic_id: topic.id }}>
                    <View style={tw`flex-row items-center`}>
                      <ThemedText>{topic.name}</ThemedText>
                      <ChevronRightIcon size={16} color={colors.foreground} />
                    </View>
                  </HapticTouchableOpacity>
                  <ThemedText>{progression}%</ThemedText>
                </View>
                <ProgressBar current={current} total={total} />
              </View>
            );
          })}
        </View>
      )}

      {displayedTopics.length === 0 ? (
        <ThemedText>Commence à explorer du contenu pour voir ta progression !</ThemedText>
      ) : (
        orderedProgressionTopics.length > 3 && (
          <HapticTouchableOpacity
            onPress={() => setShowAll(!showAll)}
            event="user_viewed_all_topics_progression">
            <ThemedText semibold>{showAll ? "Voir moins" : "Voir plus"}</ThemedText>
          </HapticTouchableOpacity>
        )
      )}
    </Card>
  );
}
