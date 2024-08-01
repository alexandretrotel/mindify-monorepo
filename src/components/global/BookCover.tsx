import React from "react";
import { Card } from "@/components/ui/card";
import H5Span from "@/components/typography/h5";
import Span from "@/components/typography/span";
import { sourceToString } from "@/utils/topics";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import type { Enums } from "@/types/supabase";
import { Muted } from "@/components/typography/muted";

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
  source: Enums<"source">;
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
        <div className="flex flex-col">
          <H5Span>{title}</H5Span>
          {source === "book" && <Muted size="sm">{author}</Muted>}

          <Span primaryColor size="xs">
            {category} • {sourceToString(source)}
          </Span>
        </div>
      </div>
    </Card>
  );
};

export default BookCover;
