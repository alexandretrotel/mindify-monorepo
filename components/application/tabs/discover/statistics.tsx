import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TypographyH3 from "@/components/typography/h3";
import { Area, AreaChart, Bar, BarChart, Rectangle, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import type { UserReads } from "@/types/user";
import type { Summaries } from "@/types/summary/summary";
import { getDateRange } from "@/utils/date";

const Statistics = ({ userReads, summaries }: { userReads: UserReads; summaries: Summaries }) => {
  const summariesRead = userReads?.length;

  const weekReadsData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const formattedDate = date.toISOString().split("T")[0];
    const reads = userReads?.filter((read) => {
      const readDate = new Date(read.created_at);
      return (
        readDate.getDate() === date.getDate() &&
        readDate.getMonth() === date.getMonth() &&
        readDate.getFullYear() === date.getFullYear()
      );
    }).length;
    return { date: formattedDate, reads };
  });

  const minDate = new Date(
    Math.min(...userReads.map((read) => new Date(read.created_at).getTime()))
  );
  const maxDate = new Date(
    Math.max(...userReads.map((read) => new Date(read.created_at).getTime()))
  );

  const dateRange = getDateRange(minDate, maxDate);

  const weekReadTimeData = dateRange.map((date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const reads = userReads?.filter((read) => {
      const readDate = new Date(read.created_at);
      return (
        readDate.getDate() === date.getDate() &&
        readDate.getMonth() === date.getMonth() &&
        readDate.getFullYear() === date.getFullYear()
      );
    });
    const time = reads.reduce((acc, read) => {
      const summary = summaries.find((summary) => summary.id === read.summary_id);
      return acc + (summary?.reading_time ?? 0);
    }, 0);
    return { date: formattedDate, time };
  });

  // now we can calculate the total reading time
  const totalReadingTime = userReads?.reduce((acc, read) => {
    const summary = summaries.find((summary) => summary.id === read.summary_id);
    return acc + (summary?.reading_time ?? 0);
  }, 0);
  const totalReadingTimeInMinutes = Math.floor(totalReadingTime % 60);
  const totalReadingTimeInHours = Math.floor((totalReadingTime - totalReadingTimeInMinutes) / 60);
  const remainingMinutes = totalReadingTime % 60;

  return (
    <>
      <div className="block lg:hidden">
        <TypographyH3>Mes statistiques</TypographyH3>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:h-full lg:grid-cols-1">
        <Card className="col-span-2 hidden lg:col-span-1 lg:block lg:max-w-md">
          <CardHeader className="space-y-0">
            <CardTitle className="text-xl tabular-nums">Mon profil</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="flex w-full items-center" disabled>
              Voir mon profil
              <ArrowUpRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 md:pb-2">
            <CardDescription>{summariesRead > 1 ? "Résumés lus" : "Résumé lu"}</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {summariesRead}{" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                {summariesRead > 1 ? "résumés" : "résumé"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="hidden lg:block">
            <ChartContainer
              config={{
                reads: {
                  label: "Nombre de résumés lus",
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
          </CardContent>
        </Card>

        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 md:pb-0">
            <CardDescription>Temps de lecture</CardDescription>
            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
              {totalReadingTimeInHours > 0 && (
                <>
                  {totalReadingTimeInHours}
                  <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                    h
                  </span>
                </>
              )}
              {remainingMinutes}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                {remainingMinutes > 1 ? "mins" : "min"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="hidden p-0 lg:block">
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
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Statistics;
