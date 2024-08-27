import React from "react";
import H3 from "@/components/typography/h3";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Muted } from "@/components/typography/muted";
import UserCardSkeleton from "@/components/global/skeleton/UserCardSkeleton";

const TopUsersSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Les plus grands lecteurs</H3>
        <Muted>Explorez les esprits les plus brillants de notre communauté.</Muted>
      </div>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: "auto"
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 flex">
          {Array.from({ length: 20 }).map((_, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/3 lg:basis-1/4">
              <UserCardSkeleton heightFull />
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

export default TopUsersSkeleton;
