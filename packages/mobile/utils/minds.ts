import { likeMind, saveMind, unlikeMind, unsaveMind } from "@/actions/minds.action";
import { Mind, setMind } from "@/types/minds";
import { Alert, Share } from "react-native";

/**
 * Shares a mind using the Share API.
 *
 * @param {string} userName - The name of the user sharing the mind.
 * @param {Mind} mind - The mind object containing text and summaries.
 * @returns {Promise<void>} A promise that resolves when the share action is completed.
 */
export const onShare = async (userName: string, mind: Mind) => {
  try {
    await Share.share({
      title: `${userName} te partage un MIND !`,
      message: `${mind?.text} - ${mind?.summaries?.authors?.name} dans le résumé ${mind?.summaries?.title}.`,
    });
  } catch (error) {
    console.error(error);
    Alert.alert("Une erreur est survenue lors du partage de la citation");
  }
};

/**
 * Handles saving or unsaving a mind.
 *
 * @param {string} userId - The ID of the user performing the action.
 * @param {boolean} savedMind - Current saved status of the mind.
 * @param {number} mindId - The ID of the mind to save or unsave.
 * @param {setMind} setSavedMind - State setter function for saved mind status.
 * @param {React.Dispatch<React.SetStateAction<number>>} [setSavedMindCount] - Optional state setter for saved mind count.
 * @returns {Promise<void>} A promise that resolves when the save or unsave action is completed.
 */
export const handleSaveMind = async (
  userId: string | null,
  savedMind: boolean,
  mindId: number,
  setSavedMind: setMind,
  setSavedMindCount?: React.Dispatch<React.SetStateAction<number>>,
) => {
  if (!userId) {
    Alert.alert("Tu dois être connecté pour sauvegarder un MIND");
    return;
  }

  if (savedMind) {
    try {
      setSavedMind(false);
      if (setSavedMindCount) {
        setSavedMindCount((count) => count - 1);
      }
      await unsaveMind(mindId, userId);
    } catch (error) {
      setSavedMind(true);
      if (setSavedMindCount) {
        setSavedMindCount((count) => count + 1);
      }
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la suppression du MIND");
    }
  } else {
    try {
      setSavedMind(true);
      if (setSavedMindCount) {
        setSavedMindCount((count) => count + 1);
      }
      await saveMind(mindId, userId);
    } catch (error) {
      setSavedMind(false);
      if (setSavedMindCount) {
        setSavedMindCount((count) => count - 1);
      }
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la sauvegarde du MIND");
    }
  }
};

/**
 * Handles liking or unliking a mind.
 *
 * @param {string} userId - The ID of the user performing the action.
 * @param {boolean} likedMind - Current liked status of the mind.
 * @param {number} mindId - The ID of the mind to like or unlike.
 * @param {setMind} setLikedMind - State setter function for liked mind status.
 * @param {React.Dispatch<React.SetStateAction<number>>} [setLikedMindCount] - Optional state setter for liked mind count.
 * @returns {Promise<void>} A promise that resolves when the like or unlike action is completed.
 */
export const handleLikeMind = async (
  userId: string,
  likedMind: boolean,
  mindId: number,
  setLikedMind: setMind,
  setLikedMindCount?: React.Dispatch<React.SetStateAction<number>>,
) => {
  if (!userId) {
    Alert.alert("Tu dois être connecté pour aimer un MIND");
    return;
  }

  if (likedMind) {
    try {
      setLikedMind(false);
      if (setLikedMindCount) {
        setLikedMindCount((count) => count - 1);
      }
      await unlikeMind(mindId, userId);
    } catch (error) {
      setLikedMind(true);
      if (setLikedMindCount) {
        setLikedMindCount((count) => count + 1);
      }
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la suppression du like du MIND");
    }
  } else {
    try {
      setLikedMind(true);
      if (setLikedMindCount) {
        setLikedMindCount((count) => count + 1);
      }
      await likeMind(mindId, userId);
    } catch (error) {
      setLikedMind(false);
      if (setLikedMindCount) {
        setLikedMindCount((count) => count - 1);
      }
      console.error(error);
      Alert.alert("Une erreur est survenue lors du like du MIND");
    }
  }
};
