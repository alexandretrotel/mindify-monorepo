import { getUserReadSummariesCount } from "@/actions/users.action";
import { useEffect, useState } from "react";

/**
 * Hook to get the user read summaries count
 *
 * @param userId The user id
 * @returns The read summaries count
 */
export default function useUserReadSummariesCount(userId: string) {
  const [readSummariesCount, setReadSummariesCount] = useState<number>(0);

  useEffect(() => {
    const fetchReadSummariesCount = async () => {
      try {
        const count = await getUserReadSummariesCount(userId);
        setReadSummariesCount(count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReadSummariesCount();
  }, [userId]);

  return { readSummariesCount };
}
