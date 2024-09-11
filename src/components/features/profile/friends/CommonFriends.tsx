import React from "react";
import FriendsClient from "@/components/features/profile/friends/client/FriendsClient";
import type { User } from "@supabase/supabase-js";
import { getFriendsData } from "@/actions/friends.action";
import type { UUID } from "crypto";

const CommonFriends = async ({ userId, friends }: { userId: UUID; friends: User[] }) => {
  const userFriends = await getFriendsData(userId);

  const commonFriends = friends?.filter((friend) => {
    return userFriends?.friendsData?.find((userFriend) => userFriend?.id === friend?.id);
  });

  return <FriendsClient friends={commonFriends} />;
};

export default CommonFriends;
