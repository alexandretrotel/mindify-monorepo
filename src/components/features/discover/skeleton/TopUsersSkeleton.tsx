import React from "react";
import H3 from "@/components/typography/h3";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Muted } from "@/components/typography/muted";
import UserCardSkeleton from "@/components/global/skeleton/UserCardSkeleton";

const TopUsersSkeleton = async () => {
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
          <H3>Les plus grands lecteurs</H3>
          <Muted>Explorez les esprits les plus brillants de notre communauté.</Muted>
        </div>

        <CarouselContent className="-ml-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/3 lg:basis-1/4">
              <UserCardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
};

export default TopUsersSkeleton;
