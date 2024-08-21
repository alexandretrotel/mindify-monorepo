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

const PopularSkeleton = async () => {
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
          <H3>Les + populaires</H3>
          <Muted>Explorez les résumés les plus lus.</Muted>
        </div>

        <CarouselContent className="-ml-4">
          {[...Array(15)].map((_, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/3 lg:basis-1/4">
              <BookCoverSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden lg:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </Carousel>
  );
};

export default PopularSkeleton;
