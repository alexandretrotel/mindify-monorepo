import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import TypographyH3 from "@/components/typography/h3";
import TypographySpan from "@/components/typography/span";
import BookCoverSkeleton from "@/components/global/skeleton/BookCoverSkeleton";

const PersonalizedSkeleton = async () => {
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
          <TypographyH3>Pour vous</TypographyH3>
          <TypographySpan muted>Découvrez des résumés adaptés à vos intérêts.</TypographySpan>
        </div>

        <CarouselContent className="-ml-4">
          {[...Array(15)].map((_, index) => (
            <CarouselItem key={index} className="basis-1/2 pl-4 lg:basis-1/3">
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

export default PersonalizedSkeleton;
