import { supabase } from "@/lib/supabase";
import { useSession } from "@/providers/SessionProvider";
import { getAvatar } from "@/utils/avatars";
import { type UserMetadata } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to fetch and manage user metadata
 *
 * @param profileId The user id to fetch metadata from
 * @returns An object containing the user metadata and some functions to manage it
 */
export default function useProfileMetadata(profileId: string) {
  const { session } = useSession();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarURL, setAvatarURL] = useState<string | null>(null);
  const [biography, setBiography] = useState("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const getUserMetadata = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc("fetch_user_metadata", {
        user_id: profileId,
      });

      if (error) {
        throw new Error("Erreur de chargement du profil");
      }

      const metadata = JSON.parse(JSON.stringify(data)) as UserMetadata;

      const { name, biography } = metadata;
      const avatar = getAvatar(metadata);

      setUsername(name);
      setBiography(biography);
      setAvatarURL(avatar);
    } catch (error) {
      console.error(error);
    }
  }, [profileId]);

  useEffect(() => {
    const fetchInitUserMetadata = async () => {
      setLoading(true);
      try {
        await getUserMetadata();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchInitUserMetadata();
    }
  }, [getUserMetadata, session]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUserMetadata().then(() => setRefreshing(false));
  }, [getUserMetadata]);

  return {
    loading,
    username,
    avatarURL,
    biography,
    getUserMetadata,
    onRefresh,
    refreshing,
  };
}
