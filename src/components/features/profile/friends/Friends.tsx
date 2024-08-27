import React from "react";
import { getFriendsData } from "@/actions/friends";
import { UUID } from "crypto";
import { getAvatar } from "@/utils/users";
import FriendsClient from "@/components/features/profile/friends/client/FriendsClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@supabase/supabase-js";

const getCommonOrPendingFriends = async (
  userId: UUID,
  profileFriends: {
    friendsData: User[];
    askedFriendsData: User[];
  },
  isMyProfile: boolean
) => {
  const userFriends = await getFriendsData(userId);

  if (!isMyProfile) {
    const commonFriends = profileFriends?.friendsData.filter((friend) => {
      return userFriends?.friendsData?.find((userFriend) => userFriend?.id === friend?.id);
    });

    return commonFriends;
  }

  const pendingFriends = userFriends?.askedFriendsData;

  return pendingFriends;
};

const Friends = async ({
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

  const friends = await getFriendsData(profileId);
  const commonOrPendingFriends = await getCommonOrPendingFriends(profileId, friends, isMyProfile);

  const friendsPicture =
    friends?.friendsData?.map((friend) => {
      const picture = getAvatar(friend?.user_metadata);
      return picture;
    }) ?? [];

  if (!friends || friends?.friendsData?.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-2xl font-semibold">
        Aucun ami
      </div>
    );
  }

  return (
    <Tabs className="flex flex-col gap-4" defaultValue="all">
      <TabsList className="flex w-fit">
        <TabsTrigger value="all">Tous les amis</TabsTrigger>
        {!isMyProfile && <TabsTrigger value="common">En commun</TabsTrigger>}
        {isMyProfile && <TabsTrigger value="pending">En attente</TabsTrigger>}
      </TabsList>

      <div className="flex flex-col">
        <TabsContent value="all">
          <FriendsClient friends={friends?.friendsData} friendsPicture={friendsPicture} />
        </TabsContent>

        {!isMyProfile && (
          <TabsContent value="common">
            <FriendsClient friends={commonOrPendingFriends} friendsPicture={friendsPicture} />
          </TabsContent>
        )}

        {isMyProfile && (
          <TabsContent value="pending">
            <FriendsClient
              friends={commonOrPendingFriends}
              friendsPicture={friendsPicture}
              cancelFriendRequestObject={
                isMyProfile && {
                  userId,
                  profileId,
                  isConnected,
                  displayButton: true
                }
              }
            />
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
};

export default Friends;
