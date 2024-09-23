import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FriendsSkeleton from "@/components/features/profile/friends/skeleton/FriendsSkeleton";

const FriendsTabsSkeleton = async ({ isMyProfile }: { isMyProfile: boolean }) => {
  if (isMyProfile) {
    return (
      <Tabs className="flex flex-col gap-4" defaultValue="all">
        <TabsList className="flex w-fit">
          <TabsTrigger value="all">Tous les amis</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
        </TabsList>

        <div className="flex flex-col">
          <TabsContent value="all">
            <FriendsSkeleton />
          </TabsContent>

          <TabsContent value="pending">
            <FriendsSkeleton />
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
          <FriendsSkeleton />
        </TabsContent>

        <TabsContent value="common">
          <FriendsSkeleton />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default FriendsTabsSkeleton;
