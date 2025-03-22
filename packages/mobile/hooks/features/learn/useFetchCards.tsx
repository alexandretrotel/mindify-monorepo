import { getUserSavedMinds, getUserSrsData } from "@/actions/users.action";
import { useSession } from "@/providers/SessionProvider";
import { State } from "ts-fsrs";
import { Alert } from "react-native";
import { useCallback, useEffect, useState } from "react";

type Card = {
  summaries: {
    authors: {
      name: string;
    };
    title: string;
  };
  created_at: string;
  id: number;
  mindify_ai: boolean | null;
  question: string | null;
  summary_id: number | null;
  text: string;
};

/**
 * A hook that fetches the user's SRS data.
 *
 * @returns The unknown, known, learning, and due cards count, the cards, and the loading state.
 */
export default function useFetchCards() {
  const [unknownCards, setUnknownCards] = useState<number>(0);
  const [knownCards, setKnownCards] = useState<number>(0);
  const [learningCards, setLearningCards] = useState<number>(0);
  const [isLearningModalVisible, setIsLearningModalVisible] = useState<boolean>(false);
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [currentDeckCardsCount, setCurrentDeckCardsCount] = useState<number>(0);
  const [dueCards, setDueCards] = useState<number>(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { userId } = useSession();

  const fetchSrsData = useCallback(async () => {
    setLoading(true);

    if (!userId) {
      return;
    }

    try {
      const data = await getUserSrsData(userId);
      const savedMinds = await getUserSavedMinds(userId);
      const savedMindsCount = savedMinds?.length;

      const unknownCards =
        data?.filter((card) => card.state === State.New)?.length ?? savedMindsCount;
      const learningCards =
        data?.filter((card) => card.state === State.Learning || card.state === State.Relearning)
          ?.length ?? 0;
      const knownCards = data?.filter((card) => card.state === State.Review)?.length ?? 0;

      setUnknownCards(unknownCards);
      setLearningCards(learningCards);
      setKnownCards(knownCards);

      if (data?.length < savedMindsCount) {
        const savedMindsIds = savedMinds?.map((mind) => mind?.id);
        const existingMinds = data?.filter((card) => savedMindsIds.includes(card.mind_id));

        const now = new Date().getTime();
        const dueCards = existingMinds?.filter((card) => new Date(card.due).getTime() <= now);

        const dueCardsMinds = savedMinds?.filter((mind) => {
          if (!mind?.id) {
            return false;
          }

          return dueCards?.map((card) => card.mind_id).includes(mind?.id);
        });

        const allMinds = savedMinds
          ?.filter((mind) => {
            if (!mind?.id) {
              return false;
            }

            return !existingMinds?.map((card) => card.mind_id).includes(mind?.id);
          })
          ?.concat(dueCardsMinds);

        const dueCardsCount = allMinds?.length;

        setUnknownCards(savedMindsCount - existingMinds?.length);

        setDueCards(dueCardsCount);
        setCards(allMinds);
      } else {
        const now = new Date().getTime();
        const dueCards = data?.filter((card) => new Date(card.due).getTime() <= now)?.length;

        const cards = data?.map((card) => card.minds) ?? [];

        setDueCards(dueCards);
        setCards(cards);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de récupérer les données SRS.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchSrsData();
    }
  }, [fetchSrsData, userId]);

  const handleLearning = (cardsCount: number) => {
    setIsLearningModalVisible(true);
    setCurrentCard(1);
    setCurrentDeckCardsCount(cardsCount);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSrsData().then(() => setRefreshing(false));
  }, [fetchSrsData]);

  return {
    unknownCards,
    knownCards,
    learningCards,
    isLearningModalVisible,
    setIsLearningModalVisible,
    currentCard,
    setCurrentCard,
    currentDeckCardsCount,
    dueCards,
    cards,
    loading,
    refreshing,
    onRefresh,
    handleLearning,
    fetchSrsData,
  };
}
