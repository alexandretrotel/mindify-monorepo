import {
  markSummaryAsRead,
  markSummaryAsUnread,
  saveSummary,
  unsaveSummary,
} from "@/actions/users.action";
import { Alert, Share } from "react-native";
import * as WebBrowser from "expo-web-browser";
import useSummary from "@/hooks/global/summaries/useSummary";

type Summary = Awaited<ReturnType<typeof useSummary>>["summary"];

/**
 * Handles saving or unsaving a summary for a user.
 *
 * @param userId - The ID of the user.
 * @param summary - The summary object containing details.
 * @param isSavedSummary - A boolean indicating if the summary is currently saved.
 * @param setIsSavedSummary - A state setter function to update the saved status.
 */
export const handleSaveSummary = async (
  userId: string | null,
  summary: Summary,
  isSavedSummary: boolean,
  setIsSavedSummary: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (!userId || !summary?.id) {
    return;
  }

  setIsSavedSummary(!isSavedSummary);

  try {
    if (isSavedSummary) {
      await unsaveSummary(userId, summary?.id);
    } else {
      await saveSummary(userId, summary?.id);
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Erreur", "Une erreur est survenue lors de la sauvegarde");

    setIsSavedSummary(!isSavedSummary);
  }
};

/**
 * Opens the original source of the summary in a web browser.
 *
 * @param summary - The summary object containing the source URL.
 */
export const handleSeeOriginal = async (summary: Summary) => {
  if (!summary?.source_url) {
    return;
  }

  try {
    await WebBrowser.openBrowserAsync(summary?.source_url);
  } catch (error) {
    console.error(error);
    Alert.alert("Erreur", "Impossible d'ouvrir le lien");
  }
};

/**
 * Shares the summary via the share interface.
 *
 * @param summary - The summary object containing details to share.
 */
export const handleShareSummary = async (summary: Summary) => {
  try {
    await Share.share({
      title: summary?.title,
      message: `Découvre le résumé ${summary?.title} de ${summary?.authors?.name} sur Mindify.`,
      url: `mindify://summary/${summary?.id}`,
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Marks a summary as read for the user.
 *
 * @param userId - The ID of the user.
 * @param setIsRead - A state setter function to update the read status.
 * @param summaryId - The ID of the summary to mark as read.
 */
export const handleMarkSummaryAsRead = async (
  userId: string,
  setIsRead: React.Dispatch<React.SetStateAction<boolean>>,
  summaryId: number,
) => {
  if (!userId) {
    Alert.alert("Erreur", "Impossible de marquer le résumé comme lu");
    return;
  }

  setIsRead(true);

  try {
    await markSummaryAsRead(userId, summaryId);
  } catch (error) {
    console.error(error);
    setIsRead(false);
    Alert.alert("Erreur", "Impossible de marquer le résumé comme lu");
  }
};

/**
 * Marks a summary as unread for the user.
 *
 * @param userId - The ID of the user.
 * @param setIsRead - A state setter function to update the read status.
 * @param summaryId - The ID of the summary to mark as unread.
 */
export const handleMarkSummaryAsUnread = async (
  userId: string,
  setIsRead: React.Dispatch<React.SetStateAction<boolean>>,
  summaryId: number,
) => {
  if (!userId) {
    Alert.alert("Erreur", "Impossible de marquer le résumé comme non lu");
    return;
  }

  setIsRead(false);

  try {
    await markSummaryAsUnread(userId, summaryId);
  } catch (error) {
    console.error(error);
    setIsRead(true);
    Alert.alert("Erreur", "Impossible de marquer le résumé comme non lu");
  }
};
