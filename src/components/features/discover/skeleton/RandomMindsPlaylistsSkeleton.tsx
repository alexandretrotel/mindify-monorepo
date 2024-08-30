import React from "react";
import H3 from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import MindsPlaylistsSkeleton from "@/components/global/skeleton/MindsPlaylistsSkeleton";

const RandomMindsPlaylistsSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Atteignez vos objectifs</H3>
        <Muted>Les sélections de MINDS qui vous aideront à avancer.</Muted>
      </div>

      <MindsPlaylistsSkeleton />
    </div>
  );
};

export default RandomMindsPlaylistsSkeleton;
