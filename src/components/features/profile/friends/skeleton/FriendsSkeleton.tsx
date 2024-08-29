import React from "react";
import UserCardSkeleton from "@/components/global/skeleton/UserCardSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FriendsSkeleton = async () => {
  return (
    <Tabs className="flex flex-col gap-4" defaultValue="all">
      <TabsList className="flex w-fit">
        <TabsTrigger value="all">Tous les amis</TabsTrigger>
        <TabsTrigger value="common">En commun</TabsTrigger>
      </TabsList>

      <div className="flex flex-col">
        <TabsContent value="all">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => {
              return <UserCardSkeleton key={index} heightFull />;
            })}
          </div>
        </TabsContent>

        <TabsContent value="common">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => {
              return <UserCardSkeleton key={index} heightFull />;
            })}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default FriendsSkeleton;
