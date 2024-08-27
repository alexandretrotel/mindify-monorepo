"use client";
import "client-only";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import type { Tables } from "@/types/supabase";
import Mind from "@/components/global/Mind";
import { UUID } from "crypto";

const MindsClient = ({
  minds,
  initialAreSaved,
  userId,
  isConnected,
  userName
}: {
  minds: (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[];
  initialAreSaved: boolean[];
  userId: UUID;
  isConnected: boolean;
  userName: string;
}) => {
  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: "auto"
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4 flex">
        {minds?.map((mind, index) => {
          return (
            <CarouselItem key={mind.id} className="pl-4 lg:basis-1/2">
              <Mind
                mind={mind}
                initialIsSaved={initialAreSaved[index]}
                userId={userId}
                isConnected={isConnected}
                userName={userName}
                heightFull
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <div className="hidden lg:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default MindsClient;
