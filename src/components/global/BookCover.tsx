import React from "react";
import { Card } from "@/components/ui/card";
import TypographyH5AsSpan from "@/components/typography/h5";
import TypographySpan from "../typography/span";
import type { Source } from "@/types/summary";
import { sourceToString } from "@/utils/topics";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const BookCover = ({
  title,
  author,
  category,
  source,
  image
}: {
  title: string;
  author: string;
  category: string;
  source: Source;
  image: string | undefined;
}) => {
  return (
    <Card className="h-full w-full flex-shrink-0 overflow-hidden rounded-md hover:border-primary active:border-black">
      {image ? (
        <Image
          src={image}
          fill={true}
          className="h-48 w-full object-cover object-center"
          alt={title}
        />
      ) : (
        <Skeleton className="h-48 w-full rounded-none" />
      )}
      <div className="p-4">
        <TypographyH5AsSpan>{title}</TypographyH5AsSpan>
        <TypographySpan muted size="sm">
          {author}
        </TypographySpan>
        <TypographySpan isPrimaryColor size="xs">
          {category} • {sourceToString(source)}
        </TypographySpan>
      </div>
    </Card>
  );
};

export default BookCover;
