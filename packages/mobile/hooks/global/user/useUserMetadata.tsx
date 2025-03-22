import { supabase } from "@/lib/supabase";
import type { UserMetadata } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch and manage user metadata
 *
 * @param userId The user id to fetch metadata from
 * @returns An object containing the user metadata
 */
export default function useUserMetadata(userId: string) {
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);

  useEffect(() => {
    const fetchUserMetadata = async () => {
      const { data, error } = await supabase.rpc("fetch_user_metadata", {
        user_id: userId,
      });

      if (error) {
        console.error(error);
        return;
      }

      const metadata = JSON.parse(JSON.stringify(data)) as UserMetadata;

      setUserMetadata(metadata);
    };

    if (userId) {
      fetchUserMetadata();
    }
  }, [userId]);

  return { userMetadata };
}
