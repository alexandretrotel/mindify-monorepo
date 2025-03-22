import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import H3 from "@/components/typography/h3";
import { Skeleton } from "@/components/ui/skeleton";
import { Muted } from "@/components/typography/muted";

const CategoriesSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Vos intérêts</H3>
        <Muted>Explorez des résumés en fonction de certains sujets.</Muted>
      </div>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 flex">
          {[...Array(6)].map((_, index) => (
            <CarouselItem key={index} className="pl-4">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CategoriesSkeleton;
