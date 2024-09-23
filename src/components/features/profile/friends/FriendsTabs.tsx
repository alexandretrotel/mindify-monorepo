"use client";
import "client-only";

import React from "react";
import FriendsClient from "@/components/features/profile/friends/client/FriendsClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@supabase/supabase-js";
import { FriendRequestObject } from "@/components/features/profile/friends/Friends";
import { FriendStatus } from "@/types/friends";
import type { UUID } from "crypto";

const FriendsTabs = ({
  isMyProfile,
  profileFriends,
  friendRequestObject,
  commonFriends,
  userId,
  isConnected
}: {
  isMyProfile: boolean;
  profileFriends: {
    friendsData: User[];
    askedFriendsData: User[];
    requestedFriendsData: User[];
  };
  friendRequestObject: FriendRequestObject;
  commonFriends: User[];
  userId: UUID;
  isConnected: boolean;
}) => {
  const [friendStatuses, setFriendStatuses] = React.useState<FriendStatus[]>([]);

  const memoizedFriendRequestObject = React.useMemo(() => {
    if (isMyProfile && profileFriends) {
      return {
        userId,
        isConnected,
        pendingFriends: profileFriends?.askedFriendsData,
        requestedFriends: profileFriends?.requestedFriendsData
      };
    }
    return null;
  }, [isMyProfile, profileFriends, userId, isConnected]);

  const memoizedRequestedAndPendingFriends = React.useMemo(() => {
    if (friendRequestObject) {
      return friendRequestObject?.requestedFriends?.concat(profileFriends?.askedFriendsData);
    }
    return [];
  }, [friendRequestObject, profileFriends]);

  React.useEffect(() => {
    if (memoizedRequestedAndPendingFriends) {
      setFriendStatuses(
        memoizedRequestedAndPendingFriends?.map((friend) => {
          if (
            memoizedFriendRequestObject?.requestedFriends?.find(
              (requestedFriend) => requestedFriend.id === friend.id
            )
          ) {
            return "requested";
          }

          if (
            memoizedFriendRequestObject?.pendingFriends?.find(
              (pendingFriend) => pendingFriend.id === friend.id
            )
          ) {
            return "pending";
          }

          return "none";
        })
      );
    }
  }, [memoizedFriendRequestObject, memoizedRequestedAndPendingFriends]);

  if (isMyProfile) {
    return (
      <Tabs className="flex flex-col gap-4" defaultValue="all">
        <TabsList className="flex w-fit">
          <TabsTrigger value="all">Tous les amis</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
        </TabsList>

        <div className="flex flex-col">
          <TabsContent value="all">
            <FriendsClient friends={profileFriends?.friendsData} />
          </TabsContent>

          <TabsContent value="pending">
            <FriendsClient
              friends={memoizedRequestedAndPendingFriends}
              friendRequestObject={memoizedFriendRequestObject as FriendRequestObject}
              friendStatuses={friendStatuses}
              setFriendStatuses={setFriendStatuses}
            />
          </TabsContent>
        </div>
      </Tabs>
    );
  }

  return (
    <Tabs className="flex flex-col gap-4" defaultValue="all">
      <TabsList className="flex w-fit">
        <TabsTrigger value="all">Tous les amis</TabsTrigger>
        <TabsTrigger value="common">En commun</TabsTrigger>
      </TabsList>

      <div className="flex flex-col">
        <TabsContent value="all">
          <FriendsClient friends={profileFriends?.friendsData} />
        </TabsContent>

        <TabsContent value="common">
          <FriendsClient friends={commonFriends} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default FriendsTabs;
