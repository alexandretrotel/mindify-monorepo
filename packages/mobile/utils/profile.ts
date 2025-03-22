import { Share } from "react-native";

/**
 * Shares a user's profile through the native sharing options using deep linking.
 * @param {string} username - The username of the profile owner.
 * @param {string} profileId - The unique profile ID of the user.
 * @returns {Promise<void>} - A promise that resolves when the sharing action is completed.
 */
export const handleShareProfile = async (username: string, profileId: string) => {
  try {
    await Share.share({
      title: `${username}`,
      message: `Découvre le profil de ${username} sur l'application !`,
      url: `mindify://profile/${profileId}`,
    });
  } catch (error) {
    console.error(error);
  }
};
