import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import H3 from "@/components/typography/h3";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { UUID } from "crypto";

const StatisticsSkeleton = async ({ userId }: { userId: UUID }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="block lg:hidden">
        <H3>Mes statistiques</H3>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:h-full lg:grid-cols-1">
        <Card className="col-span-2 hidden lg:col-span-1 lg:block lg:max-w-md">
          <CardHeader className="space-y-0">
            <CardTitle className="text-xl tabular-nums">Mon profil</CardTitle>
          </CardHeader>

          <CardContent>
            <Button asChild>
              <Link href={`/app/profile/${userId}`} className="flex w-full items-center">
                Voir mon profil
                <ArrowUpRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </Button>
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
