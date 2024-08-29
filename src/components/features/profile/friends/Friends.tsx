import React from "react";
import { getFriendsData } from "@/actions/friends";
import { UUID } from "crypto";
import FriendsClient from "@/components/features/profile/friends/client/FriendsClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@supabase/supabase-js";

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

  const profileFriends = await getFriendsData(profileId);

  const userFriends = await getFriendsData(userId);

  let commonFriends;
  let requestedFriends;
  let pendingFriends;
  let requestedAndPendingFriends;
  if (!isMyProfile) {
    commonFriends = profileFriends?.friendsData?.filter((friend) => {
      return userFriends?.friendsData?.find((userFriend) => userFriend?.id === friend?.id);
    });
  } else {
    requestedFriends = userFriends?.requestedFriendsData;
    pendingFriends = userFriends?.askedFriendsData;

    requestedAndPendingFriends = [...requestedFriends, ...pendingFriends];
  }

  if (!profileFriends || profileFriends?.friendsData?.length === 0) {
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
          <FriendsClient friends={profileFriends?.friendsData} />
        </TabsContent>

        {!isMyProfile && (
          <TabsContent value="common">
            <FriendsClient friends={commonFriends as User[]} />
          </TabsContent>
        )}

        {isMyProfile && (
          <TabsContent value="pending">
            <FriendsClient
              friends={requestedAndPendingFriends as User[]}
              friendRequestObject={
                isMyProfile && {
                  userId,
                  isConnected,
                  pendingFriends,
                  requestedFriends,
                  displayCancelButton: pendingFriends?.some(
                    (profileUser) => profileUser?.id === profileId
                  ) as boolean,
                  displayRequestButton: requestedFriends?.some(
                    (profileUser) => profileUser?.id === profileId
                  ) as boolean
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
