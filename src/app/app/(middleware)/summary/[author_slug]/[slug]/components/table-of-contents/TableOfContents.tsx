import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import Link from "next/link";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { getSummaryChapters } from "@/actions/summaries";

const TableOfContents = async ({ summaryId }: { summaryId: number }) => {
  const summaryChapters = await getSummaryChapters(summaryId);

  return (
    <Card>
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="w-full">
            <div className="flex w-full items-center justify-between gap-4">
              <TypographyH3AsSpan>Table des matières</TypographyH3AsSpan>
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="#introduction" className="text-primary hover:underline">
                  1. Introduction
                </Link>
              </li>
              {summaryChapters?.titles?.map((title, index) => (
                <li key={title}>
                  <Link
                    href={"#chapter" + String(index + 1)}
                    className="text-primary hover:underline"
                  >
                    {index + 2}. {title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="#conclusion" className="text-primary hover:underline">
                  {summaryChapters?.titles?.length ? summaryChapters?.titles?.length + 2 : 2}.
                  Conclusion
                </Link>
              </li>
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TableOfContents;
