import React from "react";
import { UUID } from "crypto";
import FriendsClient from "@/components/features/profile/friends/client/FriendsClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@supabase/supabase-js";
import { FriendRequestObject } from "@/components/features/profile/friends/Friends";

const FriendsTabs = async ({
  profileId,
  profileName,
  isConnected,
  isMyProfile,
  userId,
  profileFriends,
  requestedFriends,
  friendRequestObject,
  commonFriends
}: {
  profileId: UUID;
  profileName: string;
  isConnected: boolean;
  isMyProfile: boolean;
  userId: UUID;
  profileFriends: {
    friendsData: User[];
    askedFriendsData: User[];
    requestedFriendsData: User[];
  };
  requestedFriends: User[];
  friendRequestObject: FriendRequestObject;
  commonFriends: User[];
}) => {
  const pendingFriends = friendRequestObject?.pendingFriends;
  const requestedAndPendingFriends = requestedFriends.concat(pendingFriends);

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
              friends={requestedAndPendingFriends}
              friendRequestObject={friendRequestObject}
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
