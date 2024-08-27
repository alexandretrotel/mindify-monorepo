import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import H3 from "@/components/typography/h3";
import BookCoverSkeleton from "@/components/global/skeleton/BookCoverSkeleton";
import { Muted } from "@/components/typography/muted";

const PersonalizedSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Pour vous</H3>
        <Muted>Découvrez des résumés adaptés à vos intérêts.</Muted>
      </div>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 flex">
          {[...Array(15)].map((_, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/3 lg:basis-1/4">
              <BookCoverSkeleton heightFull />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden lg:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default PersonalizedSkeleton;
