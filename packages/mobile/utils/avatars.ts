import type { UserMetadata } from "@supabase/supabase-js";

/**
 * Retrieves the avatar URL from the user's profile metadata.
 *
 * This function checks for a custom avatar, then a picture, and finally
 * the avatar URL in that order. If none of these are available, it returns
 * an empty string.
 *
 * @param {UserMetadata} profileMetadata - The metadata of the user profile
 * containing avatar information.
 * @returns {string} The URL of the user's avatar or an empty string if no
 * avatar is found.
 */
export function getAvatar(profileMetadata: UserMetadata | null): string | null {
  if (!profileMetadata) {
    return null;
  }

  const avatar =
    profileMetadata?.custom_avatar ?? profileMetadata?.picture ?? profileMetadata?.avatar_url;

  return avatar;
}
