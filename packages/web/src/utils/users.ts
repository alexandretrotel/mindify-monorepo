import type { UserMetadata } from "@supabase/supabase-js";

export function getAvatar(profileMetadata: UserMetadata): string {
  const avatar =
    profileMetadata?.custom_avatar ?? profileMetadata?.picture ?? profileMetadata?.avatar_url;

  return avatar;
}
