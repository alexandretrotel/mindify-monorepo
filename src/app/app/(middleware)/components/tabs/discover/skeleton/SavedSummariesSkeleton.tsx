import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import H3 from "@/components/typography/h3";
import BookCoverSkeleton from "@/components/global/skeleton/BookCoverSkeleton";
import { Muted } from "@/components/typography/muted";

const SavedSummariesSkeleton = async () => {
  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: "auto"
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <H3>Votre librairie</H3>
          <Muted>Retrouvez les résumés que vous avez sauvegardés.</Muted>
        </div>

        <CarouselContent className="-ml-4">
          {Array.from({ length: 15 }).map((_, index) => {
            return (
              <CarouselItem key={index} className="pl-4 lg:basis-1/3">
                <BookCoverSkeleton />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="hidden lg:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </Carousel>
  );
};

export default SavedSummariesSkeleton;
