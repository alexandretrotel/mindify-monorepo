import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import TypographyH3 from "@/components/typography/h3";
import TypographyP from "@/components/typography/p";
import { Skeleton } from "@/components/ui/skeleton";

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
          <TypographyH3>Les + populaires</TypographyH3>
          <TypographyP muted>Explorez les résumés les plus lus.</TypographyP>
        </div>

        <CarouselContent className="-ml-4">
          {[...Array(15)].map((_, index) => (
            <CarouselItem key={index} className="basis-1/2 pl-4 lg:basis-1/3">
              <Skeleton className="h-72 w-full" />
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
