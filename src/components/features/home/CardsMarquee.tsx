import { getFirstSummaries } from "@/actions/summaries";
import React from "react";
import type { Tables } from "@/types/supabase";
import CardsMarqueeClient from "@/components/features/home/client/CardsMarqueeClient";

const CardsMarquee = async () => {
  const summaries = (await getFirstSummaries(10)) as (Tables<"summaries"> & {
    authors: Tables<"authors">;
    topics: Tables<"topics">;
  })[];

  return <CardsMarqueeClient summaries={summaries} />;
};

export default CardsMarquee;
