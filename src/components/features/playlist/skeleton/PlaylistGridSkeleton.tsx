import MindSkeleton from "@/components/global/skeleton/MindSkeleton";
import React from "react";

const PlaylistGridSkeleton = async () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => {
        return <MindSkeleton key={index} />;
      })}
    </div>
  );
};

export default PlaylistGridSkeleton;
