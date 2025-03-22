import type { Tables } from "@/types/supabase";
import type { UUID } from "crypto";
import React from "react";
import Playlist from "@/components/global/Playlist";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import PlaylistSkeleton from "@/components/global/skeleton/PlaylistSkeleton";

const MindsPlaylistsSkeleton = async () => {
  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: "auto"
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4 flex">
        {Array.from({ length: 6 }).map((_, index) => {
          return (
            <CarouselItem key={index} className="basis-1/2 pl-4">
              <PlaylistSkeleton />
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

export default MindsPlaylistsSkeleton;
