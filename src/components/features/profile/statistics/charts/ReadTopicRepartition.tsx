import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import type { Tables } from "@/types/supabase";
import { getSummariesTopicRepartition } from "@/utils/statistics";
import React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

const ReadTopicRepartition = ({
  readSummaries
}: {
  readSummaries: (Tables<"summaries"> & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
  })[];
}) => {
  const readingRepartitionData = getSummariesTopicRepartition(readSummaries);
  const sortedRepartitionData = [...readingRepartitionData]?.sort(
    (a, b) => b?.summaries - a?.summaries
  );
  const readingRepartition = sortedRepartitionData?.slice(0, 6);

  if (readingRepartition?.length === 0) {
    return null;
  }

  const radarChartData = [...readingRepartition]?.sort((a, b) => a?.topic?.localeCompare(b?.topic));

  const radarChartConfig = {
    summary: {
      label: "Résumés",
      color: "hsl(var(--chart-1))"
    }
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-2 rounded-lg border">
      <div className="space-y-0 p-6 lg:pb-2">
        <CardDescription>Thèmes les plus lus</CardDescription>
        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
          {readingRepartition?.length}{" "}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            thème{readingRepartition?.length > 1 ? "s" : ""}
          </span>
        </CardTitle>
      </div>

      <ChartContainer
        config={radarChartConfig}
        className="mx-auto aspect-square h-[250px] max-h-[250px] w-full pb-0"
      >
        <RadarChart data={radarChartData}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis dataKey="topic" />
          <PolarGrid />
          <Radar dataKey="summaries" fill="var(--color-summary)" fillOpacity={0.6} />
        </RadarChart>
      </ChartContainer>
    </div>
  );
};

export default ReadTopicRepartition;
