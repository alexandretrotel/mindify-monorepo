import { getUserFriends } from "@/actions/users.action";
import type { Friend } from "@/types/friends";
import { useEffect, useState } from "react";

/**
 * A hook to get the friends of a user
 *
 * @param userId The id of the user
 * @returns The friends and the loading state
 */
export default function useUserFriends(userId: string) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        const friends = await getUserFriends(userId);
        setFriends(friends);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  return { friends, loading };
}
