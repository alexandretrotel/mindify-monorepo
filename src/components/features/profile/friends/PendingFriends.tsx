import React from "react";
import FriendsClient from "@/components/features/profile/friends/client/FriendsClient";
import type { User } from "@supabase/supabase-js";
import type { UUID } from "crypto";

const PendingFriends = async ({
  userId,
  userFriends,
  isMyProfile,
  isConnected
}: {
  userId: UUID;
  userFriends: {
    requestedFriendsData: User[];
    askedFriendsData: User[];
    friendsData: User[];
  };
  isMyProfile: boolean;
  isConnected: boolean;
}) => {
  const requestedFriends = userFriends?.requestedFriendsData;
  const pendingFriends = userFriends?.askedFriendsData;

  const requestedAndPendingFriends = requestedFriends.concat(pendingFriends);

  const friendRequestObject = isMyProfile
    ? {
        userId,
        isConnected,
        pendingFriends,
        requestedFriends
      }
    : undefined;

  return (
    <FriendsClient friends={requestedAndPendingFriends} friendRequestObject={friendRequestObject} />
  );
};

export default PendingFriends;
