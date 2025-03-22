import MindSkeleton from "@/components/global/skeleton/MindSkeleton";
import React from "react";

const ProfileMindsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => {
        return <MindSkeleton key={index} />;
      })}
    </div>
  );
};

export default ProfileMindsSkeleton;
