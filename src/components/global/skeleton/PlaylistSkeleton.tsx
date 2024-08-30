import React from "react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";

const PlaylistSkeleton = async () => {
  return (
    <div className={`flex h-48 flex-col justify-between gap-8 rounded-lg bg-primary p-6`}>
      <Skeleton className="h-16 w-40" />

      <Button variant="secondary" className="w-fit" disabled>
        Voir la playlist
      </Button>
    </div>
  );
};

export default PlaylistSkeleton;
