import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ChaptersSkeleton = async () => {
  return (
    <React.Fragment>
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-32 w-full" />
        </div>
      ))}
    </React.Fragment>
  );
};

export default ChaptersSkeleton;
