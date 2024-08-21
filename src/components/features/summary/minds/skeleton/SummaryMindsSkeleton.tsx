import MindsSkeleton from "@/components/global/skeleton/MindsSkeleton";
import H2 from "@/components/typography/h2";
import { Carousel } from "@/components/ui/carousel";
import React from "react";

const SummaryMindsSkeleton = async () => {
  return (
    <Carousel
      opts={{
        align: "start",
        slidesToScroll: "auto"
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-4">
        <H2>Les MINDS de ce résumé</H2>
        <MindsSkeleton />
      </div>
    </Carousel>
  );
};

export default SummaryMindsSkeleton;
