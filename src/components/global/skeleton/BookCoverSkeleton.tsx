import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BookCoverSkeleton = () => {
  return (
    <Card className="h-full w-full flex-shrink-0 overflow-hidden rounded-md hover:border-primary active:border-black">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </Card>
  );
};

export default BookCoverSkeleton;
