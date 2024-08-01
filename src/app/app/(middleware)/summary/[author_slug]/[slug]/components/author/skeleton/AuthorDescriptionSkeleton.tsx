import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import H3Span from "@/components/typography/h3AsSpan";

const AuthorDescriptionSkeleton = async () => {
  return (
    <Card>
      <Collapsible>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="w-full">
            <div className="flex w-full items-center justify-between gap-4">
              <H3Span>À propos de l&apos;auteur</H3Span>
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent>
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}

              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AuthorDescriptionSkeleton;
