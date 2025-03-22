import React from "react";
import H2 from "@/components/typography/h2";
import { Skeleton } from "@/components/ui/skeleton";

const AuthorDescriptionMobileSkeleton = async () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <H2>À propos de l&apos;auteur</H2>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}

        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};

export default AuthorDescriptionMobileSkeleton;
