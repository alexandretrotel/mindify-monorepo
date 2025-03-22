import { getUserFriendsCount } from "@/actions/users.action";
import { useEffect, useState } from "react";

/**
 * Hook to get the count of friends of a user
 *
 * @param userId The id of the user
 * @returns The count of friends
 */
export default function useUserFriendsCount(userId: string) {
  const [friendsCount, setFriendsCount] = useState<number>(0);

  useEffect(() => {
    const fetchFriendsCount = async () => {
      try {
        const count = await getUserFriendsCount(userId);
        setFriendsCount(count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriendsCount();
  }, [userId]);

  return { friendsCount };
}
