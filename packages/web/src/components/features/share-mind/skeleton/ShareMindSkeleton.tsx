import MindSkeleton from "@/components/global/skeleton/MindSkeleton";
import Semibold from "@/components/typography/semibold";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ShareMindSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <Semibold>
        Partagé par <Skeleton className="h-4 w-20" />
      </Semibold>

      <MindSkeleton />
    </div>
  );
};

export default ShareMindSkeleton;
