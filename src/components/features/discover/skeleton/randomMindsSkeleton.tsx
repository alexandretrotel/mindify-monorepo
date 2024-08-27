import React from "react";
import H3 from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import MindsSkeleton from "@/components/global/skeleton/MindsSkeleton";

const RandomMindsSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Quelques MINDS au hasard</H3>
        <Muted>De quoi vous inspirer.</Muted>
      </div>

      <MindsSkeleton />
    </div>
  );
};

export default RandomMindsSkeleton;
