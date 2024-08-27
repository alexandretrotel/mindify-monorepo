import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import H2 from "@/components/typography/h2";
import BookCoverSkeleton from "@/components/global/skeleton/BookCoverSkeleton";

const SuggestionsSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <H2>À découvrir aussi...</H2>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {[...Array(4)].map((_, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/4 lg:basis-1/4">
              <BookCoverSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default SuggestionsSkeleton;
