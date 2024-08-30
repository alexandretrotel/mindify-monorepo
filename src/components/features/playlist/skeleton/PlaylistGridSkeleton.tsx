import MindSkeleton from "@/components/global/skeleton/MindSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const PlaylistGridSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-12 w-96" />

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => {
          return <MindSkeleton key={index} />;
        })}
      </div>
    </div>
  );
};

export default PlaylistGridSkeleton;
