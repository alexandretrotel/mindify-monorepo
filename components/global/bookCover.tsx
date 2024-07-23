import React from "react";
import { Card } from "@/components/ui/card";
import TypographyH5AsSpan from "@/components/typography/h5";
import TypographyP from "@/components/typography/p";

const BookCover = ({ title, author }: { title: string; author: string }) => {
  return (
    <Card className="h-auto w-56 flex-shrink-0 rounded-md hover:border-primary active:border-black">
      <div className="h-48 w-full rounded-t-md bg-slate-200" />
      <div className="p-4">
        <TypographyH5AsSpan>{title}</TypographyH5AsSpan>
        <TypographyP muted>{author}</TypographyP>
      </div>
    </Card>
  );
};

export default BookCover;
