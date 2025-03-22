import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import Link from "next/link";
import H3Span from "@/components/typography/h3AsSpan";
import type { Tables } from "@/types/supabase";

const TableOfContents = async ({ chapters }: { chapters: Tables<"chapters"> }) => {
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
              {chapters?.titles?.map((title, index) => (
                <li key={title}>
                  <a href={"#chapter" + String(index + 1)} className="text-primary hover:underline">
                    {index + 1}. {title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TableOfContents;
