import { CardDescription, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Tables } from "@/types/supabase";
import { getDateRangeUntilNow } from "@/utils/date";
import React from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";

const AllTimeReadingTime = ({
  userReads,
  readSummaries
}: {
  userReads: Tables<"read_summaries">[];
  readSummaries: Tables<"summaries">[];
}) => {
  const minDate = new Date(
    Math.min(...userReads.map((read) => new Date(read?.created_at).getTime()))
  );

  const dateRange = getDateRangeUntilNow(minDate);

  const weekReadTimeData = dateRange?.map((date: Date) => {
    const formattedDate = date?.toISOString()?.split("T")[0];
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
      const summary = readSummaries?.find((summary) => summary?.id === read?.summary_id);
      return acc + (summary?.reading_time ?? 0);
    }, 0);
    return { date: formattedDate, time };
  });

  if (!weekReadTimeData || weekReadTimeData?.length === 0) {
    return null;
  }

  const totalReadingTime =
    userReads?.reduce((acc, read) => {
      const summary = readSummaries?.find((summary) => summary?.id === read?.summary_id);
      return acc + (summary?.reading_time ?? 0);
    }, 0) ?? 0;
  const totalReadingTimeInMinutes = Math.floor(totalReadingTime % 60);
  const totalReadingTimeInHours = Math.floor((totalReadingTime - totalReadingTimeInMinutes) / 60);
  const remainingMinutes = totalReadingTime % 60;

  if (!totalReadingTime || totalReadingTime === 0) {
    return null;
  }

  return (
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
  );
};

export default AllTimeReadingTime;
