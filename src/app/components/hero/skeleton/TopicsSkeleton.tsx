import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TopicsSkeleton = async () => {
  return (
    <div className="mx-auto mt-10 flex max-w-lg flex-wrap justify-center gap-2 sm:mt-20">
      {[...Array(12)].map((_, index) => (
        <div key={index}>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
};

export default TopicsSkeleton;
