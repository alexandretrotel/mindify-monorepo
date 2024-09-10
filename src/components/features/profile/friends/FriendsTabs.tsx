import React, { Suspense } from "react";
import { getFriendsData } from "@/actions/friends.action";
import { UUID } from "crypto";
import FriendsClient from "@/components/features/profile/friends/client/FriendsClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendsSkeleton from "@/components/features/profile/friends/skeleton/FriendsSkeleton";
import CommonFriends from "@/components/features/profile/friends/CommonFriends";
import PendingFriends from "@/components/features/profile/friends/PendingFriends";

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
          <Suspense fallback={<FriendsSkeleton />}>
            <FriendsClient friends={profileFriends?.friendsData} />
          </Suspense>
        </TabsContent>

        {!isMyProfile && (
          <TabsContent value="common">
            <Suspense fallback={<FriendsSkeleton />}>
              <CommonFriends userId={userId} friends={profileFriends?.friendsData} />
            </Suspense>
          </TabsContent>
        )}

        {isMyProfile && (
          <TabsContent value="pending">
            <Suspense fallback={<FriendsSkeleton />}>
              <PendingFriends
                userId={userId}
                userFriends={profileFriends}
                isConnected={isConnected}
                isMyProfile={isMyProfile}
              />
            </Suspense>
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
};

export default Friends;
