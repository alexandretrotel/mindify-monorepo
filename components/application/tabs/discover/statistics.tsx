import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TypographyH3 from "@/components/typography/h3";
import { Bar, BarChart, Rectangle, XAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const Statistics = () => {
  const [summariesReadThisWeek, setSummariesReadThisWeek] = React.useState<number>(0);

  return (
    <>
      <TypographyH3>Mes statistiques</TypographyH3>
      <Card className="lg:max-w-md">
        <CardHeader className="space-y-0 pb-2">
          <CardDescription>Cette semaine</CardDescription>
          <CardTitle className="text-4xl tabular-nums">
            {summariesReadThisWeek}{" "}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              résumés
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default Statistics;
