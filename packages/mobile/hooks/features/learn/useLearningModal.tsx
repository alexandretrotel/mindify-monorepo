import { updateSrsData } from "@/actions/srs.action";
import type { Tables } from "@/types/supabase";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { Grade } from "ts-fsrs";

/** A hook that handles the learning modal.
 *
 * @param fetchSrsData The function to fetch the user's SRS data.
 * @param cardsCount The cards count.
 * @param currentCard The current card.
 * @param setCurrentCard The function to set the current card.
 * @param setIsLearningModalVisible The function to set the learning modal visibility.
 * @param cards The cards.
 * @param isFlipped The card flip state.
 * @returns The finished state, start time, end time, total time, the next handler, the update card SRS data handler, and the close handler.
 */
export default function useLearningModal(
  fetchSrsData: () => void,
  cardsCount: number,
  currentCard: number,
  setCurrentCard: (card: number) => void,
  setIsLearningModalVisible: (isVisible: boolean) => void,
  cards: (Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
    };
  })[],
  isFlipped: SharedValue<boolean>,
) {
  const [finished, setFinished] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<string>("");
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    const now = Date.now();
    setStartTime(now);
  }, []);

  useEffect(() => {
    if (finished) {
      setEndTime(Date.now());
    }
  }, [finished]);

  useEffect(() => {
    if (startTime && endTime && startTime > 0 && endTime > 0) {
      const totalTimeInMs = endTime - startTime;
      const totalTime = new Date(totalTimeInMs > 0 ? totalTimeInMs : 0);

      const minutes = totalTime.getUTCMinutes().toString().padStart(2, "0");
      const seconds = totalTime.getUTCSeconds().toString().padStart(2, "0");

      let formattedTime = "";
      if (minutes === "00" && seconds === "00") {
        formattedTime = "0s";
      } else if (minutes === "00") {
        formattedTime = `${parseInt(seconds)}s`;
      } else {
        const formattedSeconds = seconds.startsWith("0") ? seconds.slice(1) : seconds;
        formattedTime = `${parseInt(minutes)}m ${formattedSeconds}s`;
      }

      setTotalTime(formattedTime);
    }
  }, [startTime, endTime]);

  const handleNext = useCallback(() => {
    if (currentCard >= cardsCount) {
      setFinished(true);
      return;
    }

    isFlipped.value = false;
    setCurrentCard(currentCard + 1);
  }, [currentCard, cardsCount, isFlipped, setCurrentCard]);

  const handleClose = () => {
    setIsLearningModalVisible(false);
    setCurrentCard(0);
    setFinished(false);
    setStartTime(null);
    setEndTime(null);
    setTotalTime("");
    fetchSrsData();
  };

  const handleUpdateCardSrsData = useCallback(
    async (userId: string, grade: Grade) => {
      handleNext();

      try {
        await updateSrsData(cards[currentCard - 1].id, userId, grade);
      } catch (error) {
        console.error("Erreur lors de la mise à jour des données SRS", error);
        Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour des données SRS");

        if (currentCard > 0) {
          setCurrentCard(currentCard - 1);
        }
      }
    },
    [cards, currentCard, handleNext, setCurrentCard],
  );

  return {
    finished,
    startTime,
    endTime,
    totalTime,
    handleNext,
    handleUpdateCardSrsData,
    handleClose,
    currentCard,
    cardsCount,
  };
}
