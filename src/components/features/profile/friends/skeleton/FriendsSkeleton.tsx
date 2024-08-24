import React from "react";
import UserCardSkeleton from "@/components/global/skeleton/UserCardSkeleton";

const FriendsSkeleton = async () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => {
        return <UserCardSkeleton key={index} />;
      })}
    </div>
  );
};

export default FriendsSkeleton;
