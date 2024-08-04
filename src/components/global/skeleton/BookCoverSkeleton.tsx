import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BookCoverSkeleton = () => {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg border hover:border-primary active:border-black">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};

export default BookCoverSkeleton;
