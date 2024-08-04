"use client";
import "client-only";

import React from "react";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import type { Tables } from "@/types/supabase";
import Mind from "@/components/global/Mind";

const MindsClient = ({
  minds,
  initialAreSaved
}: {
  minds: (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[];
  initialAreSaved: boolean[];
}) => {
  return (
    <>
      <CarouselContent className="-ml-4 flex">
        {minds?.map((mind, index) => {
          return (
            <CarouselItem key={mind.id} className="pl-4 lg:basis-1/2">
              <Mind mind={mind} initialIsSaved={initialAreSaved[index]} />
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <div className="hidden lg:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </>
  );
};

export default MindsClient;
