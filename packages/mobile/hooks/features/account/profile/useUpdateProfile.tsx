import { updateProfile } from "@/actions/users.action";
import { useSession } from "@/providers/SessionProvider";
import { getAvatar } from "@/utils/avatars";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * A hook that updates the user's profile.
 *
 * @returns The initial username, username, initial biography, biography, avatar, email, change username handler, change biography handler, can update state, updating state, and update handler.
 */
export default function useUpdateProfile() {
  const [initialUsername, setInitialUsername] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [initialBiography, setInitialBiography] = useState<string>("");
  const [biography, setBiography] = useState<string>("");
  const [canUpdate, setCanUpdate] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const { userMetadata } = useSession();

  const avatar = getAvatar(userMetadata);
  const email = userMetadata?.email;

  useEffect(() => {
    if (userMetadata) {
      setInitialUsername(userMetadata.name);
      setUsername(userMetadata.name);
      setInitialBiography(userMetadata.biography);
      setBiography(userMetadata.biography);
    }
  }, [userMetadata]);

  useEffect(() => {
    const hasChanged = initialUsername !== username || initialBiography !== biography;
    setCanUpdate(hasChanged);
  }, [initialUsername, initialBiography, username, biography]);

  const handleChangeUsername = (value: string) => {
    setUsername(value);
  };

  const handleChangeBiography = (value: string) => {
    setBiography(value);
  };

  const handleUpdateProfile = async () => {
    if (!canUpdate) return;

    setUpdating(true);

    try {
      await updateProfile(username, biography);
      setInitialUsername(username);
      setInitialBiography(biography);
    } catch (error) {
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la mise à jour du profil");
    } finally {
      setUpdating(false);
    }
  };

  return {
    initialUsername,
    setInitialUsername,
    username,
    setUsername,
    initialBiography,
    setInitialBiography,
    biography,
    setBiography,
    avatar,
    email,
    handleChangeUsername,
    handleChangeBiography,
    canUpdate,
    updating,
    setUpdating,
    handleUpdateProfile,
  };
}
