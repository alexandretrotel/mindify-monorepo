import { getUserSavedMinds } from "@/actions/users.action";
import { Tables } from "@/types/supabase";
import { useEffect, useState } from "react";

/**
 * Hook to get the saved minds of a user
 *
 * @param userId The id of the user
 * @returns The saved minds and the loading state
 */
export default function useUserSavedMinds(userId: string) {
  const [savedMinds, setSavedMinds] = useState<
    (Tables<"minds"> & {
      summaries: Tables<"summaries"> & {
        authors: Tables<"authors">;
      };
    })[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSavedMinds = async () => {
      if (!userId) {
        return;
      }

      setLoading(true);

      try {
        const savedMinds = await getUserSavedMinds(userId);
        const orderedSavedMinds = [...savedMinds]?.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setSavedMinds(orderedSavedMinds);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedMinds();
  }, [userId]);

  return { savedMinds, loading };
}
