import { getAuthorFromSummaryId } from "@/actions/authors";
import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import H3Span from "@/components/typography/h3AsSpan";
import Span from "@/components/typography/span";

const AuthorDescription = async ({ summaryId }: { summaryId: number }) => {
  const author = await getAuthorFromSummaryId(summaryId);

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
            <Span>{author?.description ?? "Aucune description disponible."}</Span>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AuthorDescription;
