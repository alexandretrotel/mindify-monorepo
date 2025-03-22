import {
  hasUserReadSummary,
  hasUserSavedSummary,
  markSummaryAsRead,
  markSummaryAsUnread,
  saveSummary,
  getUserSummaryRating,
  unsaveSummary,
} from "@/actions/users.action";
import { rateSummary } from "@/actions/summaries.action";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

/**
 * Hook to get the user summary state
 *
 * @param userId The user id
 * @param summaryId The summary id
 * @param setIsRead The function to set the isRead state
 * @returns The user summary state
 */
export default function useUserSummaryState(
  userId: string | null,
  summaryId: number,
  topicId?: number,
) {
  const [isRead, setIsRead] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [markingAsRead, setMarkingAsRead] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [rating, setRating] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchIsRead = async () => {
      if (!userId || !summaryId) {
        return;
      }

      try {
        const isRead = await hasUserReadSummary(userId, summaryId);
        setIsRead(isRead);
      } catch (error) {
        console.error("Error fetching isRead:", error);
      }
    };

    if (userId && summaryId) {
      fetchIsRead();
    }
  }, [userId, summaryId]);

  useEffect(() => {
    const fetchIsSaved = async () => {
      if (!userId || !summaryId) {
        return;
      }

      try {
        const isSaved = await hasUserSavedSummary(userId, summaryId);
        setIsSaved(isSaved);
      } catch (error) {
        console.error("Error fetching isSaved:", error);
      }
    };

    if (userId && summaryId) {
      fetchIsSaved();
    }
  }, [userId, summaryId]);

  useEffect(() => {
    const fetchRating = async () => {
      if (!userId || !summaryId) {
        return;
      }

      const oldRating = rating;

      try {
        const rating = await getUserSummaryRating(userId, summaryId);
        setRating(rating);
      } catch (error) {
        setRating(oldRating);
        console.error(error);
      }
    };

    if (userId && summaryId) {
      fetchRating();
    }
  }, [userId, summaryId, rating]);

  const handleMarkAsRead = useCallback(async () => {
    if (isRead || markingAsRead || !userId || !summaryId) {
      return;
    }

    setMarkingAsRead(true);

    try {
      setIsRead(true);
      await markSummaryAsRead(userId, summaryId);
    } catch (error) {
      setIsRead(false);
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la mise à jour de la lecture");
    } finally {
      setMarkingAsRead(false);
    }
  }, [isRead, markingAsRead, summaryId, userId]);

  const handleMarkAsUnread = useCallback(async () => {
    if (!isRead || markingAsRead || !userId || !summaryId) {
      return;
    }

    setMarkingAsRead(true);

    try {
      setIsRead(false);
      await markSummaryAsUnread(userId, summaryId);
    } catch (error) {
      setIsRead(true);
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la mise à jour de la lecture");
    } finally {
      setMarkingAsRead(false);
    }
  }, [isRead, markingAsRead, summaryId, userId]);

  const handleSaving = useCallback(async () => {
    if (saving || !userId || !summaryId) {
      return;
    }

    setSaving(true);

    try {
      setIsSaved(true);
      await saveSummary(userId, summaryId);
    } catch (error) {
      setIsSaved(false);
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }, [saving, summaryId, userId]);

  const handleUnsaving = useCallback(async () => {
    if (saving || !userId || !summaryId) {
      return;
    }

    setSaving(true);

    try {
      setIsSaved(false);
      await unsaveSummary(userId, summaryId);
    } catch (error) {
      setIsSaved(true);
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }, [saving, summaryId, userId]);

  const toggleRead = useCallback(() => {
    if (isRead) {
      handleMarkAsUnread();
    } else {
      handleMarkAsRead();
      router.push(`/summary/end/${topicId}`);
    }
  }, [handleMarkAsRead, handleMarkAsUnread, isRead, topicId]);

  const toggleSave = useCallback(() => {
    if (isSaved) {
      handleUnsaving();
    } else {
      handleSaving();
    }
  }, [handleSaving, handleUnsaving, isSaved]);

  const handleRateSummary = useCallback(
    async (currentRating: number) => {
      if (!userId || !summaryId || currentRating === undefined) {
        return;
      }

      const oldRating = rating;

      try {
        setRating(currentRating);
        await rateSummary(userId, summaryId, currentRating);
      } catch (error) {
        setRating(oldRating);
        console.error(error);
        Alert.alert("Une erreur est survenue lors de la mise à jour de la note");
      }
    },
    [rating, summaryId, userId],
  );

  return {
    isRead,
    setIsRead,
    isSaved,
    setIsSaved,
    handleMarkAsRead,
    handleMarkAsUnread,
    markingAsRead,
    saving,
    handleSaving,
    toggleRead,
    rating,
    handleRateSummary,
    handleUnsaving,
    toggleSave,
  };
}
