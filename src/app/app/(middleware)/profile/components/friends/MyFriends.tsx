import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFriendsData, getPendingFriendsData } from "@/actions/friends";
import { UUID } from "crypto";
import MyFriendClient from "./client/MyFriendClient";

const MyFriends = async ({ userId }: { userId: UUID }) => {
  const friends = await getFriendsData({ userId });
  const pendingFriends = await getPendingFriendsData({ userId });

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
        />
      </div>
    </Tabs>
  );
};

export default MyFriends;
