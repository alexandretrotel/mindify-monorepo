import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import H3Span from "@/components/typography/h3AsSpan";
import { Skeleton } from "@/components/ui/skeleton";

const TableOfContentsSkeleton = async () => {
  return (
    <Card>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="w-full">
            <div className="flex w-full items-center justify-between gap-4">
              <H3Span>Table des matières</H3Span>
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <li key={index}>
                  <Skeleton className="h-4 w-full" />
                </li>
              ))}
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TableOfContentsSkeleton;
