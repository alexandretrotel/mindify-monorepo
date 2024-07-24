import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TypographyH3 from "@/components/typography/h3";
import { Area, AreaChart, Bar, BarChart, Rectangle, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";

const Statistics = () => {
  const [summariesReadThisWeek, setSummariesReadThisWeek] = React.useState<number>(0);
  const [readingHour, setReadingHour] = React.useState<number>(0);
  const [readingMinute, setReadingMinute] = React.useState<number>(0);

  return (
    <>
      <div className="block md:hidden">
        <TypographyH3>Mes statistiques</TypographyH3>
      </div>
      <div className="block md:hidden">
        <TypographyH3>Mes statistiques</TypographyH3>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
        <Card className="col-span-2 hidden lg:col-span-1 lg:block lg:max-w-md">
          <CardHeader className="space-y-0">
            <CardTitle className="text-xl tabular-nums">Mon profil</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="flex w-full items-center">
              Voir mon profil
              <ArrowUpRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 md:pb-2">
            <CardDescription>Cette semaine</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {summariesReadThisWeek}{" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                résumés
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="hidden lg:block">
            <ChartContainer
              config={{
                steps: {
                  label: "Steps",
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
                data={[
                  {
                    date: "2024-01-01",
                    steps: 2000
                  },
                  {
                    date: "2024-01-02",
                    steps: 2100
                  },
                  {
                    date: "2024-01-03",
                    steps: 2200
                  },
                  {
                    date: "2024-01-04",
                    steps: 1300
                  },
                  {
                    date: "2024-01-05",
                    steps: 1400
                  },
                  {
                    date: "2024-01-06",
                    steps: 2500
                  },
                  {
                    date: "2024-01-07",
                    steps: 1600
                  }
                ]}
              >
                <Bar
                  dataKey="steps"
                  fill="var(--color-steps)"
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
              {readingHour}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                h
              </span>
              {readingMinute}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                min
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
                data={[
                  {
                    date: "2024-01-01",
                    time: 8.5
                  },
                  {
                    date: "2024-01-02",
                    time: 7.2
                  },
                  {
                    date: "2024-01-03",
                    time: 8.1
                  },
                  {
                    date: "2024-01-04",
                    time: 6.2
                  },
                  {
                    date: "2024-01-05",
                    time: 5.2
                  },
                  {
                    date: "2024-01-06",
                    time: 8.1
                  },
                  {
                    date: "2024-01-07",
                    time: 7.0
                  }
                ]}
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
                  type="natural"
                  fill="url(#fillTime)"
                  fillOpacity={0.4}
                  stroke="var(--color-time)"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => (
                    <div className="flex min-w-[120px] flex-col text-xs text-muted-foreground">
                      Temps de lecture
                      <div className="flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                        <span className="font-normal text-muted-foreground">h</span>
                      </div>
                    </div>
                  )}
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
