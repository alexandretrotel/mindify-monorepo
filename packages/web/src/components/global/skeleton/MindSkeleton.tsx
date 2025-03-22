import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const MindSkeleton = ({ heightFull }: { heightFull?: boolean }) => {
  return (
    <div
      className={`flex ${heightFull ? "h-full max-h-96" : ""} flex-col justify-between gap-4 rounded-lg border p-6`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-48" />
        </div>

        <Skeleton className="h-32 w-full" />
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        <Button variant="outline" disabled>
          Enregistrer
        </Button>

        <Button variant="secondary" disabled>
          Partager
        </Button>
      </div>
    </div>
  );
};

export default MindSkeleton;
