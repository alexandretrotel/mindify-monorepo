"use client";
import "client-only";

import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import type { Enums, Tables } from "@/types/supabase";
import { getSummariesTypeRepartition } from "@/utils/statistics";
import React from "react";
import { Pie, PieChart } from "recharts";

const SummariesTypeRepartition = ({
  readSummaries
}: {
  readSummaries: (Tables<"summaries"> & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
  })[];
}) => {
  const typeOfSummariesRepartition = getSummariesTypeRepartition(readSummaries);

  if (!typeOfSummariesRepartition || typeOfSummariesRepartition?.length === 0) {
    return null;
  }

  const sortedTypeOfSummariesRepartition = [...typeOfSummariesRepartition]?.sort(
    (a, b) => b?.summaries - a?.summaries
  );
  const finalRepartition = sortedTypeOfSummariesRepartition?.map((record) => ({
    ...record,
    fill: `var(--color-${record?.source_type === "book" ? "book" : record?.source_type === "article" ? "article" : record?.source_type === "podcast" ? "podcast" : "video"})`
  }));

  const chartConfig: {
    [key in Enums<"source">]: {
      label: string;
      color?: string;
    };
  } = {
    book: {
      label: "Livre",
      color: "hsl(var(--chart-1))"
    },
    article: {
      label: "Article",
      color: "hsl(var(--chart-2))"
    },
    podcast: {
      label: "Podcast",
      color: "hsl(var(--chart-3))"
    },
    video: {
      label: "Vidéo",
      color: "hsl(var(--chart-4))"
    }
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-2 rounded-lg border">
      <div className="space-y-0 p-6 lg:pb-2">
        <CardDescription>Types de résumés</CardDescription>
        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
          {finalRepartition?.length}{" "}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            type{finalRepartition?.length > 1 ? "s" : ""} de résumés
          </span>
        </CardTitle>
      </div>

      <div className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[250px] max-h-[250px] w-full pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={finalRepartition} dataKey="summaries" label nameKey="source_type" />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default SummariesTypeRepartition;
