"use client";
import "client-only";

import type { Tables } from "@/types/supabase";
import { useTheme } from "next-themes";
import React from "react";
import Marquee from "react-fast-marquee";
import ContentCard from "@/components/features/home/ContentCard";

const CardsMarqueeClient = ({
  summaries
}: {
  summaries: (Tables<"summaries"> & {
    authors: Tables<"authors">;
    topics: Tables<"topics">;
  })[];
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <Marquee
      gradient
      gradientColor={resolvedTheme === "dark" ? "black" : "white"}
      className="-pl-4"
    >
      {summaries?.map((summary) => {
        return <ContentCard key={summary.id} summary={summary} />;
      })}
    </Marquee>
  );
};

export default CardsMarqueeClient;
