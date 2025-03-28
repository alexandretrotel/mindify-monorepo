import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const StatisticsSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:h-72 lg:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-lg border p-6">
          <Skeleton className="mb-4 h-16 w-full" />

          <div className="hidden lg:block">
            <Skeleton className="h-36 w-full" />
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border p-6">
          <Skeleton className="mb-4 h-16 w-full" />

          <div className="hidden lg:block">
            <Skeleton className="h-36 w-full" />
          </div>
        </div>

        <div className="hidden flex-col gap-2 rounded-lg border p-6 lg:flex">
          <Skeleton className="mb-4 h-16 w-full" />

          <div className="hidden lg:block">
            <Skeleton className="h-36 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSkeleton;
