import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FriendsSkeleton from "@/components/features/profile/friends/skeleton/FriendsSkeleton";

const FriendsTabsSkeleton = async ({ isMyProfile }: { isMyProfile: boolean }) => {
  return (
    <Tabs className="flex flex-col gap-4" defaultValue="all">
      <TabsList className="flex w-fit">
        <TabsTrigger value="all">Tous les amis</TabsTrigger>
        {!isMyProfile && <TabsTrigger value="common">En commun</TabsTrigger>}
        {isMyProfile && <TabsTrigger value="pending">En attente</TabsTrigger>}
      </TabsList>

      <div className="flex flex-col">
        <TabsContent value="all">
          <FriendsSkeleton />
        </TabsContent>

        {!isMyProfile && (
          <TabsContent value="common">
            <FriendsSkeleton />
          </TabsContent>
        )}

        {isMyProfile && (
          <TabsContent value="pending">
            <FriendsSkeleton />
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
};

export default FriendsTabsSkeleton;
