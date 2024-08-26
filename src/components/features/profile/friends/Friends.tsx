import React from "react";
import { getFriendsData } from "@/actions/friends";
import { UUID } from "crypto";
import { getAvatar } from "@/utils/users";
import FriendsClient from "@/components/features/profile/friends/client/FriendsClient";
import type { UserMetadata } from "@supabase/supabase-js";

const Friends = async ({
  profileId,
  profileName,
  isConnected
}: {
  profileId: UUID;
  profileName: string;
  isConnected: boolean;
}) => {
  if (!isConnected) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-2xl font-semibold">
        Connectez-vous pour voir les amis de {profileName}.
      </div>
    );
  }

  const friends = await getFriendsData(profileId);

  const friendsPicture =
    friends?.map((friend) => {
      const picture = getAvatar(friend?.user_metadata as UserMetadata);
      return picture;
    }) ?? [];

  if (!friends || friends?.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-2xl font-semibold">
        Aucun ami
      </div>
    );
  }

  return <FriendsClient friends={friends} friendsPicture={friendsPicture} />;
};

export default Friends;
