"use client";
import "client-only";

import { CardDescription, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Tables } from "@/types/supabase";
import React from "react";
import { Bar, BarChart, Rectangle, XAxis } from "recharts";

const WeeklyReads = ({ userReads }: { userReads: Tables<"read_summaries">[] }) => {
  const timeReadsData = Array.from({ length: 7 }, (_, i) => {
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

  if (!timeReadsData || timeReadsData?.length === 0) {
    return null;
  }

  const weeklySummaryReads = timeReadsData?.reduce((acc, item) => acc + item?.reads, 0);

  if (!weeklySummaryReads || weeklySummaryReads === 0) {
    return null;
  }

  return (
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
            data={timeReadsData}
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
  );
};

export default WeeklyReads;
