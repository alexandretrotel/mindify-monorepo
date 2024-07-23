import React from "react";
import { Card } from "@/components/ui/card";
import TypographyH5AsSpan from "@/components/typography/h5";
import TypographyP from "@/components/typography/p";
import TypographySpan from "../typography/span";

const BookCover = ({
  title,
  author,
  category
}: {
  title: string;
  author: string;
  category: string;
}) => {
  return (
    <Card className="h-auto w-full flex-shrink-0 rounded-md hover:border-primary active:border-black">
      <div className="h-48 w-full rounded-t-md bg-slate-200" />
      <div className="p-4">
        <TypographySpan isPrimaryColor size="xs">
          {category}
        </TypographySpan>
        <TypographyH5AsSpan>{title}</TypographyH5AsSpan>
        <TypographyP muted>{author}</TypographyP>
      </div>
    </Card>
  );
};

export default BookCover;
