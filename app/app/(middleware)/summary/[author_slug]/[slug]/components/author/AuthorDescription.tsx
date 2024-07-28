import { getAuthorFromSummaryId } from "@/actions/authors";
import TypographySpan from "@/components/typography/span";
import React from "react";

const AuthorDescription = async ({ summaryId }: { summaryId: number }) => {
  const author = await getAuthorFromSummaryId(summaryId);

  return (
    <TypographySpan isDefaultColor>
      {author?.description ?? "Aucune description disponible."}
    </TypographySpan>
  );
};

export default AuthorDescription;
