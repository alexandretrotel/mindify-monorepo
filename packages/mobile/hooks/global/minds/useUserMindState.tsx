import { useEffect, useState } from "react";
import {
  getLikedMindCount,
  getSavedMindCount,
  isMindLiked,
  isMindSaved,
} from "@/actions/minds.action";

/**
 * A hook to get the state of a mind for a user
 *
 * @param mindId The id of the mind
 * @param userId The id of the user
 * @returns The state of the mind for the user
 */
export default function useUserMindState(mindId: number, userId: string | null) {
  const [likedMind, setLikedMind] = useState(false);
  const [savedMind, setSavedMind] = useState(false);
  const [likedMindCount, setLikedMindCount] = useState(0);
  const [savedMindCount, setSavedMindCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchMindStates = async () => {
      try {
        const [liked, saved, likedCount, savedCount] = await Promise.all([
          isMindLiked(mindId, userId),
          isMindSaved(mindId, userId),
          getLikedMindCount(mindId),
          getSavedMindCount(mindId),
        ]);

        setLikedMind(liked);
        setSavedMind(saved);
        setLikedMindCount(likedCount ?? 0);
        setSavedMindCount(savedCount ?? 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMindStates();
  }, [mindId, userId]);

  return {
    likedMind,
    savedMind,
    likedMindCount,
    savedMindCount,
    setLikedMind,
    setSavedMind,
    setLikedMindCount,
    setSavedMindCount,
  };
}
