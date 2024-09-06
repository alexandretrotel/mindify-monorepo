import React from "react";
import Marquee from "react-fast-marquee";
import ContentCardSkeleton from "@/components/features/home/skeleton/ContentCardSkeleton";

const CardsMarqueeSkeleton = async () => {
  return (
    <Marquee pauseOnHover gradient className="-pl-4">
      {[...Array(10)].map((_, index) => {
        return <ContentCardSkeleton key={index} />;
      })}
    </Marquee>
  );
};

export default CardsMarqueeSkeleton;
