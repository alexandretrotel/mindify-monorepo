import React from "react";
import { Card } from "@/components/ui/card";
import TypographyH5AsSpan from "@/components/typography/h5";
import TypographyP from "@/components/typography/p";
import TypographySpan from "../typography/span";
import type { Source } from "@/types/summary";
import { sourceToString } from "@/utils/topics";

const BookCover = ({
  title,
  author,
  category,
  source
}: {
  title: string;
  author: string;
  category: string;
  source: Source;
}) => {
  return (
    <Card className="h-full w-full flex-shrink-0 overflow-hidden rounded-md hover:border-primary active:border-black">
      <div className="h-48 w-full bg-slate-200" />
      <div className="p-4">
        <TypographyH5AsSpan>{title}</TypographyH5AsSpan>
        <TypographyP muted size="sm">
          {author}
        </TypographyP>
        <TypographySpan isPrimaryColor size="xs">
          {category} • {sourceToString(source)}
        </TypographySpan>
      </div>
    </Card>
  );
};

export default BookCover;
