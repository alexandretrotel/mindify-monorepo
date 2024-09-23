import React from "react";
import FriendsTabs from "./FriendsTabs";
import type { UUID } from "crypto";
import { getFriendsData } from "@/actions/friends.action";
import type { User } from "@supabase/supabase-js";

export type FriendRequestObject = {
  userId: UUID;
  isConnected: boolean;
  pendingFriends: User[];
  requestedFriends: User[];
};

export default async function ProfileFriends({
  profileId,
  profileName,
  isConnected,
  isMyProfile,
  userId
}: Readonly<{
  profileId: UUID;
  profileName: string;
  isConnected: boolean;
  isMyProfile: boolean;
  userId: UUID;
}>) {
  if (!isConnected) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-2xl font-semibold">
        Connectez-vous pour voir les amis de {profileName}.
      </div>
    );
  }

  const profileFriends = await getFriendsData(profileId);

  if (!profileFriends || profileFriends?.friendsData?.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-2xl font-semibold">
        Aucun ami
      </div>
    );
  }

  const userFriends = await getFriendsData(userId);

  const requestedFriends = userFriends?.requestedFriendsData;

  let friendRequestObject: FriendRequestObject | undefined = undefined;
  let commonFriends: User[] = [];
  if (isMyProfile) {
    const pendingFriends = userFriends?.askedFriendsData;

    friendRequestObject = isMyProfile
      ? {
          userId,
          isConnected,
          pendingFriends,
          requestedFriends
        }
      : undefined;
  }

  if (!isMyProfile) {
    commonFriends = profileFriends?.friendsData?.filter((friend) => {
      return userFriends?.friendsData?.find((userFriend) => userFriend?.id === friend?.id);
    });
  }

  return (
    <FriendsTabs
      isMyProfile={isMyProfile}
      profileFriends={profileFriends}
      friendRequestObject={friendRequestObject as FriendRequestObject}
      commonFriends={commonFriends}
      userId={userId}
      isConnected={isConnected}
    />
  );
}
