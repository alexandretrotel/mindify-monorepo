import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default async function flashcardSetSkeleton({ heightFull }: { heightFull?: boolean }) {
  return (
    <Card className={`${heightFull ? "h-full max-h-56" : ""}`}>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardHeader>

      <CardFooter>
        <Button disabled>Réviser le set</Button>
      </CardFooter>
    </Card>
  );
}
