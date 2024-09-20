import React from "react";
import { getFriendsData } from "@/actions/friends.action";
import { UUID } from "crypto";
import FriendsClient from "@/components/features/profile/friends/client/FriendsClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FriendsTabs = async ({
  profileId,
  profileName,
  isConnected,
  isMyProfile,
  userId
}: {
  profileId: UUID;
  profileName: string;
  isConnected: boolean;
  isMyProfile: boolean;
  userId: UUID;
}) => {
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

  if (isMyProfile) {
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

  const commonFriends = profileFriends?.friendsData?.filter((friend) => {
    return userFriends?.friendsData?.find((userFriend) => userFriend?.id === friend?.id);
  });

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
