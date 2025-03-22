import ThemedText from "@/components/typography/ThemedText";
import { View, ScrollView, RefreshControl } from "react-native";
import React, { useCallback } from "react";
import LearningModal from "@/components/features/learning/LearningModal";
import Statistics from "@/components/features/learn/Statistics";
import CreateSetButton from "@/components/features/learn/CreateSetButton";
import DeckCard from "@/components/features/learn/DeckCard";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import { useTheme } from "@/providers/ThemeProvider";
import useFetchCards from "@/hooks/features/learn/useFetchCards";
import { useFocusEffect } from "expo-router";
import tw from "@/lib/tailwind";

export default function Learn() {
  const { colors, colorStyles } = useTheme();
  const {
    refreshing,
    onRefresh,
    unknownCards,
    learningCards,
    knownCards,
    dueCards,
    handleLearning,
    isLearningModalVisible,
    setIsLearningModalVisible,
    currentCard,
    setCurrentCard,
    cards,
    currentDeckCardsCount,
    loading,
    fetchSrsData,
  } = useFetchCards();

  const init = useCallback(() => {
    fetchSrsData();
  }, [fetchSrsData]);

  useFocusEffect(init);

  return (
    <HeaderPageContainer>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            tintColor={colors.foreground}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}>
        <View style={tw`flex h-full gap-8 justify-start items-center pt-8`}>
          <View style={tw`flex-col gap-2 w-full`}>
            <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
              Mes statistiques
            </ThemedText>

            <Statistics
              unknownCards={unknownCards}
              learningCards={learningCards}
              knownCards={knownCards}
            />
          </View>

          <View style={tw`flex-col gap-2 w-full`}>
            <ThemedText semibold style={[tw`text-lg`, colorStyles.textForeground]}>
              Mes decks
            </ThemedText>
            <View style={tw`w-full flex-col gap-4`}>
              <DeckCard dueCards={dueCards} handleLearning={handleLearning} />

              <CreateSetButton />
            </View>
          </View>
        </View>
      </ScrollView>

      <LearningModal
        isLearningModalVisible={isLearningModalVisible}
        setIsLearningModalVisible={setIsLearningModalVisible}
        currentCard={currentCard}
        setCurrentCard={setCurrentCard}
        cardsCount={currentDeckCardsCount}
        cards={cards}
        loading={loading}
        fetchSrsData={fetchSrsData}
      />
    </HeaderPageContainer>
  );
}
