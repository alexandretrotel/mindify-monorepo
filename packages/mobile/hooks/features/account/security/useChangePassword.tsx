import { updatePassword } from "@/actions/auth.action";
import { useState } from "react";
import { Alert } from "react-native";

/**
 * A hook that changes the user's password.
 *
 * @returns The new password, confirm password, updating state, and change password handler.
 */
export default function useChangePassword() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
      return;
    }

    setIsUpdating(true);

    try {
      await updatePassword(newPassword, confirmPassword);
      Alert.alert("Succès", "Mot de passe changé avec succès.");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de changer le mot de passe.");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isUpdating,
    handleChangePassword,
  };
}
