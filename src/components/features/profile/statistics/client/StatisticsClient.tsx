"use client";
import "client-only";

import React from "react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import H3 from "@/components/typography/h3";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Rectangle,
  XAxis,
  YAxis
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { getDateRangeUntilNow } from "@/utils/date";
import type { Tables } from "@/types/supabase";

const StatisticsClient = ({
  userReads,
  summaries,
  readingRepartition
}: {
  userReads: Tables<"read_summaries">[];
  summaries: Tables<"summaries">[];
  readingRepartition: { topic: string; summaries: number }[];
}) => {
  const summariesRead = userReads?.length;

  const weekReadsData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date?.getDate() - (6 - i));
    const formattedDate = date.toISOString().split("T")[0];
    const reads = userReads?.filter((read) => {
      const readDate = new Date(read?.created_at);
      if (!readDate) return false;

      return (
        readDate?.getDate() === date?.getDate() &&
        readDate?.getMonth() === date?.getMonth() &&
        readDate?.getFullYear() === date?.getFullYear()
      );
    }).length;
    return { date: formattedDate, reads };
  });

  const minDate = new Date(
    Math.min(...userReads.map((read) => new Date(read.created_at).getTime()))
  );

  const dateRange = getDateRangeUntilNow(minDate);

  const weekReadTimeData = dateRange.map((date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const reads = userReads?.filter((read) => {
      const readDate = new Date(read?.created_at);
      if (!readDate) return false;

      return (
        readDate?.getDate() === date?.getDate() &&
        readDate?.getMonth() === date?.getMonth() &&
        readDate?.getFullYear() === date?.getFullYear()
      );
    });
    const time = reads.reduce((acc, read) => {
      const summary = summaries.find((summary) => summary.id === read.summary_id);
      return acc + (summary?.reading_time ?? 0);
    }, 0);
    return { date: formattedDate, time };
  });
  const weeklySummaryReads = weekReadsData.reduce((acc, item) => acc + item.reads, 0);

  const totalReadingTime =
    userReads?.reduce((acc, read) => {
      const summary = summaries?.find((summary) => summary?.id === read?.summary_id);
      return acc + (summary?.reading_time ?? 0);
    }, 0) ?? 0;
  const totalReadingTimeInMinutes = Math.floor(totalReadingTime % 60);
  const totalReadingTimeInHours = Math.floor((totalReadingTime - totalReadingTimeInMinutes) / 60);
  const remainingMinutes = totalReadingTime % 60;

  const radarChartData = [...readingRepartition]?.sort((a, b) => a?.topic?.localeCompare(b?.topic));

  const radarChartConfig = {
    desktop: {
      label: "Résumés",
      color: "hsl(var(--chart-1))"
    }
  } satisfies ChartConfig;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-2 rounded-lg border">
        <div className="space-y-0 p-6 lg:pb-2">
          <CardDescription>Temps de lecture</CardDescription>
          <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
            {totalReadingTimeInHours > 0 && (
              <React.Fragment>
                {totalReadingTimeInHours}
                <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                  h
                </span>
              </React.Fragment>
            )}
            {remainingMinutes}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              {remainingMinutes > 1 ? "mins" : "min"}
            </span>
          </CardTitle>
        </div>

        <div className="block p-0">
          <ChartContainer
            config={{
              time: {
                label: "Time",
                color: "hsl(var(--chart-2))"
              }
            }}
          >
            <AreaChart
              accessibilityLayer
              data={weekReadTimeData}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            >
              <XAxis dataKey="date" hide />
              <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
              <defs>
                <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-time)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-time)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                dataKey="time"
                type="monotone"
                fill="url(#fillTime)"
                fillOpacity={0.4}
                stroke="var(--color-time)"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                formatter={(value) => (
                  <div className="flex min-w-[120px] flex-col items-start text-xs text-muted-foreground">
                    Temps de lecture
                    <div className="flex gap-0.5 text-left font-mono font-medium tabular-nums text-foreground">
                      {value}
                      <span className="font-normal text-muted-foreground">mins</span>
                    </div>
                  </div>
                )}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      {readingRepartition?.length > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border">
          <div className="space-y-0 p-6 lg:pb-2">
            <CardTitle>Répartition</CardTitle>
          </div>

          <ChartContainer
            config={radarChartConfig}
            className="mx-auto aspect-square h-[250px] max-h-[250px] w-full pb-0"
          >
            <RadarChart data={radarChartData}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="topic" />
              <PolarGrid />
              <Radar dataKey="summaries" fill="var(--color-desktop)" fillOpacity={0.6} />
            </RadarChart>
          </ChartContainer>
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-lg border p-6">
        <div className="space-y-0 lg:pb-2">
          <CardDescription>
            {weeklySummaryReads > 1 ? "Résumés lus cette semaine" : "Résumé lu cette semaine"}
          </CardDescription>
          <CardTitle className="text-4xl tabular-nums">
            {weeklySummaryReads}{" "}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              {weeklySummaryReads > 1 ? "résumés" : "résumé"}
            </span>
          </CardTitle>
        </div>

        <div className="block">
          <ChartContainer
            config={{
              reads: {
                label: "Résumés",
                color: "hsl(var(--chart-1))"
              }
            }}
          >
            <BarChart
              accessibilityLayer
              margin={{
                left: -4,
                right: -4
              }}
              data={weekReadsData}
            >
              <Bar
                dataKey="reads"
                fill="var(--color-reads)"
                radius={5}
                fillOpacity={0.6}
                activeBar={<Rectangle fillOpacity={0.8} />}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tickFormatter={(value) => {
                  return new Date(value).toLocaleDateString("fr", {
                    weekday: "short"
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideIndicator
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("fr", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      });
                    }}
                  />
                }
                cursor={false}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticsClient;
