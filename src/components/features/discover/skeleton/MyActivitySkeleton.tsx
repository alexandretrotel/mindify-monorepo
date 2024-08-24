import React from "react";
import H3 from "@/components/typography/h3";
import { Skeleton } from "@/components/ui/skeleton";

const MyActivitySkeleton = async () => {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      <H3>Mon activité</H3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 rounded-lg border p-6">
          <div className="flex flex-col gap-2 space-y-0 lg:pb-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border">
          <div className="flex flex-col gap-2 space-y-0 lg:pb-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyActivitySkeleton;
