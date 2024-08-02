import H3Span from "@/components/typography/h3AsSpan";
import { Muted } from "@/components/typography/muted";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const MindSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <H3Span>
            <Skeleton className="h-8 w-96" />
          </H3Span>
          <Muted>
            <Skeleton className="h-4 w-48" />
          </Muted>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full" />
      </CardContent>
      <CardFooter>
        <div className="grid w-full grid-cols-2 gap-4">
          <Button variant="outline" disabled>
            Enregistrer
          </Button>

          <Button variant="secondary" disabled>
            Partager
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MindSkeleton;
