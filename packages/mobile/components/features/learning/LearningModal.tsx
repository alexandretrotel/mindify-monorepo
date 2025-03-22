import type { Tables } from "@/types/supabase";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { Modal, View, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Rating } from "ts-fsrs";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import { XIcon } from "lucide-react-native";
import ThemedText from "@/components/typography/ThemedText";
import FlipCard from "@/components/features/learning/card/FlippingCard";
import ProgressBar from "@/components/features/learning/ProgressBar";
import ReviewButton from "@/components/features/learning/ReviewButton";
import { useTheme } from "@/providers/ThemeProvider";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import useLearningModal from "@/hooks/features/learn/useLearningModal";
import tw from "@/lib/tailwind";

export default function LearningModal({
  isLearningModalVisible,
  setIsLearningModalVisible,
  currentCard,
  setCurrentCard,
  cardsCount,
  cards,
  loading,
  fetchSrsData,
}: Readonly<{
  isLearningModalVisible: boolean;
  setIsLearningModalVisible: (isVisible: boolean) => void;
  currentCard: number;
  setCurrentCard: (card: number) => void;
  cardsCount: number;
  cards: (Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
    };
  })[];
  loading: boolean;
  fetchSrsData: () => void;
}>) {
  const isFlipped = useSharedValue(false);

  const { colorStyles, colors } = useTheme();
  const { finished, totalTime, handleClose, handleUpdateCardSrsData } = useLearningModal(
    fetchSrsData,
    cardsCount,
    currentCard,
    setCurrentCard,
    setIsLearningModalVisible,
    cards,
    isFlipped,
  );

  return (
    <Modal
      visible={isLearningModalVisible}
      animationType="slide"
      onRequestClose={() => setIsLearningModalVisible(false)}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, colorStyles.bgBackground]}>
          {finished ? (
            <View style={tw`flex h-full justify-center gap-8 items-center`}>
              <View style={tw`flex-col gap-4 items-center`}>
                <ThemedText style={[colorStyles.textForeground, tw`text-lg`]} semibold>
                  Bravo pour ta révision ! 🎉
                </ThemedText>
                <ThemedText style={[colorStyles.textForeground, tw`text-center`]}>
                  Tu aurais pu passer {totalTime} à scroller mais tu as préféré prendre ce temps
                  pour apprendre quelque chose de nouveau !
                </ThemedText>
              </View>

              <HapticTouchableOpacity onPress={handleClose} event="user_finished_flashcards_review">
                <View style={[colorStyles.bgForeground, tw`rounded-md p-4`]}>
                  <ThemedText style={colorStyles.textBackground} semibold>
                    Quitter la révision
                  </ThemedText>
                </View>
              </HapticTouchableOpacity>
            </View>
          ) : (
            <View style={tw`flex h-full justify-between gap-8 items-center`}>
              <View style={tw`flex-row justify-between shrink-0 items-center gap-4`}>
                <ThemedText semibold style={[colorStyles.textForeground, tw`text-lg`]}>
                  {currentCard}/{cardsCount}
                </ThemedText>

                <ProgressBar current={currentCard} total={cardsCount} />

                <HapticTouchableOpacity onPress={handleClose} event="user_closed_flashcards_review">
                  <XIcon size={24} color={colors.foreground} />
                </HapticTouchableOpacity>
              </View>

              <View style={tw`flex-1 w-full py-16 px-4 justify-center items-center`}>
                {loading ? (
                  <ThemedActivityIndicator />
                ) : (
                  <FlipCard card={cards[currentCard - 1]} isFlipped={isFlipped} />
                )}
              </View>

              <View style={tw`flex-col gap-2 w-full shrink-0`}>
                <View style={tw`flex-row items-center gap-2 justify-evenly w-full px-4`}>
                  <ReviewButton
                    grade={Rating.Again.valueOf()}
                    text="À revoir 🤕"
                    handleUpdateCard={handleUpdateCardSrsData}
                  />
                  <ReviewButton
                    grade={Rating.Hard.valueOf()}
                    text="Difficile 🥵"
                    handleUpdateCard={handleUpdateCardSrsData}
                  />
                </View>
                <View style={tw`flex-row items-center gap-2 justify-evenly w-full px-4`}>
                  <ReviewButton
                    grade={Rating.Good.valueOf()}
                    text="Correct 😁"
                    handleUpdateCard={handleUpdateCardSrsData}
                  />
                  <ReviewButton
                    grade={Rating.Easy.valueOf()}
                    text="Facile 😇"
                    handleUpdateCard={handleUpdateCardSrsData}
                  />
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
  },
});
