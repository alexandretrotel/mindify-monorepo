import MindSkeleton from "@/components/global/skeleton/MindSkeleton";

import React from "react";

const SummaryMindsMobileSkeleton = async () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <MindSkeleton key={index} />
      ))}
    </div>
  );
};

export default SummaryMindsMobileSkeleton;
