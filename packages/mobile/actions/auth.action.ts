"use server";

import { supabase } from "@/lib/supabase";
import { updatePasswordFormSchema } from "@/schema/auth.schema";

/**
 * Updates the user's password.
 *
 * @param {string} newPassword - The new password to set.
 * @param {string} confirmPassword - Confirmation of the new password.
 * @throws {Error} Throws an error if the passwords do not match or if the new password is invalid.
 * @returns {Promise<{ message: string }>} Returns a success message if the password is updated.
 */
export async function updatePassword(newPassword: string, confirmPassword: string) {
  if (newPassword !== confirmPassword) {
    throw new Error("Les mots de passe ne correspondent pas");
  }

  let data;
  try {
    data = updatePasswordFormSchema.parse({
      newPassword,
      confirmPassword,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Mot de passe invalide");
  }

  const { error } = await supabase.auth.updateUser({
    password: data.newPassword,
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de mettre à jour le mot de passe");
  }

  return { message: "Mot de passe mis à jour avec succès" };
}

/**
 * Deletes a user account.
 *
 * @param {string} userId - The ID of the user to delete.
 * @throws {Error} Throws an error if the account cannot be deleted.
 * @returns {Promise<{ message: string }>} Returns a success message if the account is deleted.
 */
export async function deleteUser(userId: string) {
  const { error: deleteError } = await supabase.rpc("delete_user", {
    user_id: userId,
  });

  if (deleteError) {
    console.error(deleteError);
    throw new Error("Impossible de supprimer le compte.");
  }

  return { message: "Compte supprimé avec succès." };
}
