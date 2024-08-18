import React from "react";
import H3 from "@/components/typography/h3";
import { Carousel } from "@/components/ui/carousel";
import { Muted } from "@/components/typography/muted";
import MindsSkeleton from "@/components/global/skeleton/MindsSkeleton";

const RandomMindsSkeleton = async () => {
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
          <H3>Quelques MINDS au hasard</H3>
          <Muted>De quoi vous inspirer.</Muted>
        </div>

        <MindsSkeleton />
      </div>
    </Carousel>
  );
};

export default RandomMindsSkeleton;
