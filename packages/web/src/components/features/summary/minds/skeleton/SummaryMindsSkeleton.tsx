import MindsSkeleton from "@/components/global/skeleton/MindsSkeleton";
import H2 from "@/components/typography/h2";
import React from "react";

const SummaryMindsSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <H2>Les MINDS de ce résumé</H2>
      <MindsSkeleton />
    </div>
  );
};

export default SummaryMindsSkeleton;
