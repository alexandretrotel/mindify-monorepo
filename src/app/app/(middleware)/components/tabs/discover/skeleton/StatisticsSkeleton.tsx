import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import H3 from "@/components/typography/h3";
import { Skeleton } from "@/components/ui/skeleton";

const StatisticsSkeleton = async () => {
  return (
    <div className="flex flex-col gap-4">
      <H3>Mes statistiques</H3>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 md:pb-0">
            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
              <Skeleton className="mb-4 h-16 w-full" />
            </CardTitle>
          </CardHeader>

          <CardContent className="hidden lg:block">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>

        <Card className="lg:max-w-md">
          <CardHeader className="space-y-0 md:pb-0">
            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
              <Skeleton className="mb-4 h-16 w-full" />
            </CardTitle>
          </CardHeader>

          <CardContent className="hidden lg:block">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsSkeleton;
