import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SummaryHeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-12 w-96" />
      <Skeleton className="h-8 w-48" />
    </div>
  );
};

export default SummaryHeaderSkeleton;
