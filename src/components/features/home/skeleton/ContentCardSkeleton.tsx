import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { features } from "@/data/features";
import React from "react";

const ContentCardSkeleton = async () => {
  return (
    <div
      className={`ml-4 w-96 overflow-hidden rounded-lg border border-gray-950/[.1] bg-gray-950/[.01] dark:border-gray-50/[.1] dark:bg-gray-50/[.10]`}
    >
      {features.summaryImageIsVisible && <Skeleton className="h-48 w-full rounded-none" />}

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-96" />
        </div>

        <Button
          variant="secondary"
          className="w-full hover:border-transparent hover:bg-primary hover:text-primary-foreground"
          disabled
        >
          Lire dès maintenant
        </Button>
      </div>
    </div>
  );
};

export default ContentCardSkeleton;
