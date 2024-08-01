import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import H3Span from "@/components/typography/h3AsSpan";
import { Skeleton } from "@/components/ui/skeleton";

const FriendsSkeleton = async () => {
  return (
    <Card>
      <ScrollArea className="h-96 w-full">
        <CardHeader>
          <CardTitle>
            <H3Span>Amis</H3Span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {[...Array(5)].map((_, index) => (
            <div key={index}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />

                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
              {index < 4 && <Separator className="my-4" />}
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default FriendsSkeleton;
