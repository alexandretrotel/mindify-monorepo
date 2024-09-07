import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { features } from "@/data/features";

const BookCoverSkeleton = ({ heightFull }: { heightFull?: boolean }) => {
  return (
    <div
      className={`${heightFull ? "h-full" : ""} w-full overflow-hidden rounded-lg border hover:border-primary active:border-black`}
    >
      {features.summaryImageIsVisible && <Skeleton className="h-48 w-full rounded-none" />}

      <div className="flex h-full flex-col justify-between gap-2 p-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
};

export default BookCoverSkeleton;
