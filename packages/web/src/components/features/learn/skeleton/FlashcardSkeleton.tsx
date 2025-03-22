import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function FlashcardSkeleton() {
  return (
    <Card className="flex w-full min-w-80 max-w-md flex-col md:min-w-[28rem]">
      <div className="flex h-full min-h-96 flex-col justify-between gap-4">
        <CardHeader>
          <div className="flex items-start justify-between gap-8">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Skeleton className="h-4 w-36" />
        </CardContent>

        <CardFooter>
          <Button className="w-full" disabled>
            Afficher le MIND
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
