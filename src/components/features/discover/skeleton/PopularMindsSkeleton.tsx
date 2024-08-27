import React from "react";
import H3 from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import MindsSkeleton from "@/components/global/skeleton/MindsSkeleton";

const PopularMindsSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Les MINDS préférés des utilisateurs</H3>
        <Muted>Les idées clés qui vous serviront dans votre vie.</Muted>
      </div>

      <MindsSkeleton />
    </div>
  );
};

export default PopularMindsSkeleton;
