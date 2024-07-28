import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const AuthorDescriptionSkeleton = async () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}

      <Skeleton className="h-4 w-3/4" />
    </div>
  );
};

export default AuthorDescriptionSkeleton;
