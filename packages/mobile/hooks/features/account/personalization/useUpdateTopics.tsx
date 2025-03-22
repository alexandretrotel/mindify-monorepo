import { getTopics } from "@/actions/topics.action";
import { useSession } from "@/providers/SessionProvider";
import { getUserTopics, updateUserTopics } from "@/actions/users.action";
import type { Tables } from "@/types/supabase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * A hook that fetches and updates the user's topics.
 *
 * @returns The topics, user topics, selected topics, loading state, updating state, disabled state, selection handler, and update handler.
 */
export default function useUpdateTopics() {
  const [topics, setTopics] = useState<Tables<"topics">[]>([]);
  const [userTopics, setUserTopics] = useState<Tables<"topics">[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Tables<"topics">[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const { userId } = useSession();

  useEffect(() => {
    const fetchTopics = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        const topics = await getTopics();
        const orderedTopics = [...topics].sort((a, b) => a.name.localeCompare(b.name));

        const userTopics = await getUserTopics(userId);

        setTopics(orderedTopics);
        setUserTopics(userTopics);
        setSelectedTopics(userTopics);
      } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Une erreur est survenue lors de la récupération des données");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [userId]);

  useEffect(() => {
    const disabled =
      userTopics.length === selectedTopics.length &&
      userTopics.every((topic) =>
        selectedTopics.some((selectedTopic) => selectedTopic.id === topic.id),
      );
    setDisabled(disabled);
  }, [selectedTopics, userTopics]);

  const handleSelection = (topic: Tables<"topics">) => {
    if (selectedTopics.some((selectedTopic) => selectedTopic.id === topic.id)) {
      setSelectedTopics(selectedTopics.filter((selectedTopic) => selectedTopic.id !== topic.id));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleUpdate = async () => {
    if (!userId) return;

    setUpdating(true);

    try {
      await updateUserTopics(userId, selectedTopics);
      setUserTopics(selectedTopics);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la mise à jour des données");
    } finally {
      setUpdating(false);
    }
  };

  return {
    topics,
    userTopics,
    selectedTopics,
    loading,
    updating,
    disabled,
    handleSelection,
    handleUpdate,
  };
}
