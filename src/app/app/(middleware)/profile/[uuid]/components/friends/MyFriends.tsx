import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFriendsData, getPendingFriendsData } from "@/actions/friends";
import { UUID } from "crypto";
import MyFriendClient from "./client/MyFriendClient";
import { getUserCustomAvatarFromUserId, getUserReadingStreak } from "@/actions/users";

export const revalidate = 0;

const MyFriends = async ({ userId }: { userId: UUID }) => {
  const friends = await getFriendsData(userId);
  const pendingFriends = await getPendingFriendsData(userId);

  const friendsPicture = await Promise.all(
    friends?.map(async (friend) => {
      const picture = await getUserCustomAvatarFromUserId(friend?.id as UUID);
      return picture;
    }) ?? []
  );

  const friendsReadingStreak = await Promise.all(
    friends?.map(async (friend) => {
      const readingStreak = await getUserReadingStreak(friend?.id as UUID);
      return readingStreak;
    }) ?? []
  );

  const pendingFriendsPicture = await Promise.all(
    pendingFriends?.map(async (pendingFriend) => {
      const picture = await getUserCustomAvatarFromUserId(pendingFriend?.id as UUID);
      return picture;
    }) ?? []
  );

  return (
    <Tabs defaultValue="my-friends">
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between gap-8">
          <TabsList>
            <TabsTrigger value="my-friends">Mes amis</TabsTrigger>
            <TabsTrigger value="friends-requests">
              Demandes d&apos;amis ({pendingFriends?.length ?? 0})
            </TabsTrigger>
          </TabsList>
        </div>

        <MyFriendClient
          userId={userId}
          initialFriends={friends}
          initialPendingFriends={pendingFriends}
          friendsPicture={friendsPicture}
          pendingFriendsPicture={pendingFriendsPicture}
          friendsReadingStreak={friendsReadingStreak}
        />
      </div>
    </Tabs>
  );
};

export default MyFriends;
