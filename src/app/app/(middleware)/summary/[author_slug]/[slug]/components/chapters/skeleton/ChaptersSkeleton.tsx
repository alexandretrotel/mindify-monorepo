import React from "react";
import H2 from "@/components/typography/h2";
import Span from "@/components/typography/span";
import { Skeleton } from "@/components/ui/skeleton";

const ChaptersSkeleton = async () => {
  return (
    <>
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </>
  );
};

export default ChaptersSkeleton;
