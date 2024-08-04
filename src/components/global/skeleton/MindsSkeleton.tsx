"use client";
import "client-only";

import React from "react";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import MindSkeleton from "@/components/global/skeleton/MindSkeleton";

const MindsSkeleton = () => {
  return (
    <>
      <CarouselContent className="-ml-4 flex">
        {Array.from({ length: 10 }, (_, index) => index).map((_, index) => (
          <CarouselItem key={index} className="pl-4 lg:basis-1/2">
            <MindSkeleton />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="hidden lg:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </>
  );
};

export default MindsSkeleton;
