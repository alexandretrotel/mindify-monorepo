import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import TypographyH3 from "@/components/typography/h3";
import { Skeleton } from "@/components/ui/skeleton";
import TypographySpan from "@/components/typography/span";

const CategoriesSkeleton = async () => {
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
          <TypographyH3>Vos intérêts</TypographyH3>
          <TypographySpan muted>
            Explorez des résumés en fonction de certains sujets.
          </TypographySpan>
        </div>

        <CarouselContent className="-ml-4">
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
      </div>
    </Carousel>
  );
};

export default CategoriesSkeleton;
