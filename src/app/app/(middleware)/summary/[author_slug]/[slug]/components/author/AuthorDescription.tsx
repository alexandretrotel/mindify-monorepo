import { getAuthorFromSummaryId } from "@/actions/authors";
import TypographySpan from "@/components/typography/span";
import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";

const AuthorDescription = async ({ summaryId }: { summaryId: number }) => {
  const author = await getAuthorFromSummaryId(summaryId);

  return (
    <Card>
      <Collapsible>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="w-full">
            <div className="flex w-full items-center justify-between gap-4">
              <TypographyH3AsSpan>À propos de l&apos;auteur</TypographyH3AsSpan>
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent>
            <TypographySpan isDefaultColor>
              {author?.description ?? "Aucune description disponible."}
            </TypographySpan>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AuthorDescription;
