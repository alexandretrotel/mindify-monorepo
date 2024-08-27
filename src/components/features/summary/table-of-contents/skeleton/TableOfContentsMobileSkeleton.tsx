import React from "react";
import H2 from "@/components/typography/h2";
import { Skeleton } from "@/components/ui/skeleton";

const TableOfContentsMobileSkeleton = async () => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-4">
        <H2>Table des matières</H2>
      </div>

      <ul className="flex flex-col gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <li key={index}>
            <Skeleton className="h-4 w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContentsMobileSkeleton;
