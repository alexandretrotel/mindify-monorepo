import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import ThemedText from "@/components/typography/ThemedText";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import { Stack } from "expo-router";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import CenteredContainer from "@/components/containers/CenteredContainer";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import TopicSelectionLabel from "@/components/global/topics/TopicSelectionLabel";
import useUpdateTopics from "@/hooks/features/account/personalization/useUpdateTopics";
import HapticPressable from "@/components/ui/haptic-buttons/HapticPressable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

export default function Personalization() {
  const safeAreaInsets = useSafeAreaInsets();
  const { colorStyles } = useTheme();
  const { loading, disabled, topics, handleSelection, selectedTopics, updating, handleUpdate } =
    useUpdateTopics();

  const paddingBottom = Platform.OS === "ios" ? safeAreaInsets.bottom : safeAreaInsets.bottom + 16;

  if (loading) {
    return (
      <CenteredContainer>
        <ThemedActivityIndicator />
      </CenteredContainer>
    );
  }

  return (
    <HeaderPageContainer>
      <StackScreen />
      <View style={[{ paddingBottom: paddingBottom }, tw`flex-col h-full justify-between gap-8`]}>
        <View style={tw`flex-col pt-8 gap-4`}>
          <View style={tw`flex-col`}>
            <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
              Intérêts
            </ThemedText>
            <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
              Choisis les sujets qui t'intéressent le plus.
            </ThemedText>
          </View>

          <View style={styles.container}>
            {topics.map((topic) => (
              <HapticPressable
                key={topic.id}
                onPress={() => handleSelection(topic)}
                event="user_selected_topic_personalization"
                eventProps={{
                  topic_id: topic.id,
                  topic_name: topic.name,
                }}>
                <TopicSelectionLabel
                  key={topic.id}
                  topic={topic.name}
                  emoji={topic.emoji}
                  isSelected={selectedTopics.some((selectedTopic) => selectedTopic.id === topic.id)}
                />
              </HapticPressable>
            ))}
          </View>
        </View>

        <GenericHapticButton
          onPress={handleUpdate}
          variant="default"
          textVariant="textDefault"
          event="user_updated_topics_personalization"
          eventProps={{
            topics: selectedTopics.map((topic) => ({
              topic_id: topic.id,
              topic_name: topic.name,
            })),
          }}
          disabled={disabled}
          loading={updating}>
          Enregistrer les modifications
        </GenericHapticButton>
      </View>
    </HeaderPageContainer>
  );
}

function StackScreen() {
  return (
    <Stack.Screen
      options={{
        title: "Personnalisation",
        headerTitle: "Personnalisation",
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});
