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

const MindsPlaylistsClient = async ({
  mindsPlaylists,
  userId,
  isConnected
}: {
  mindsPlaylists: (Tables<"minds_playlists"> & {
    minds: Tables<"minds">[];
  })[];
  userId: UUID;
  isConnected: boolean;
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
        {mindsPlaylists?.map((playlist) => {
          return (
            <CarouselItem key={playlist.id} className="basis-1/2 pl-4">
              <Playlist playlist={playlist} heightFull />
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

export default MindsPlaylistsClient;
