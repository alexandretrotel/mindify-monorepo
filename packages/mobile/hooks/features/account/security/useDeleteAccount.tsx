import { deleteUser } from "@/actions/auth.action";
import { useSession } from "@/providers/SessionProvider";
import { useState } from "react";
import { Alert } from "react-native";

/**
 * A hook that deletes the user's account.
 *
 * @returns The updating state and delete account handler.
 */
export default function useDeleteAccount() {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { userId } = useSession();

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Suppression du compte",
      "Tu es sûr de vouloir supprimer ton compte ? Tu risques de vraiment nous manquer...",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: async () => {
            await DeleteAccount();
          },
          style: "destructive",
        },
      ],
    );
  };

  const DeleteAccount = async () => {
    if (!userId) return;

    setIsUpdating(true);

    try {
      await deleteUser(userId);
    } catch (error) {
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la suppression du compte");
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, handleDeleteAccount };
}
