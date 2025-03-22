import React from "react";
import H5Span from "@/components/typography/h5";
import Span from "@/components/typography/span";
import { sourceToString } from "@/utils/topics";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import type { Enums } from "@/types/supabase";
import { Muted } from "@/components/typography/muted";
import Link from "next/link";
import { features } from "@/data/features";

const BookCover = ({
  title,
  author,
  category,
  source,
  image,
  authorSlug,
  summarySlug,
  heightFull
}: {
  title: string;
  author: string;
  category: string;
  source: Enums<"source">;
  image: string | undefined;
  authorSlug: string;
  summarySlug: string;
  heightFull?: boolean;
}) => {
  return (
    <Link
      href={`/summary/${authorSlug}/${summarySlug}`}
      className={`${heightFull ? "h-full" : ""}`}
    >
      <div
        className={`w-full overflow-hidden rounded-lg border hover:border-primary active:border-black ${heightFull ? "h-full max-h-48" : ""}`}
      >
        {features.summaryImageIsVisible && (
          <React.Fragment>
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
          </React.Fragment>
        )}

        <div className="flex h-full flex-col justify-between gap-2 p-4">
          <div className="flex flex-col">
            <H5Span>{title}</H5Span>
            {source === "book" && <Muted size="sm">{author}</Muted>}
          </div>

          <Span primaryColor size="xs">
            {category} • {sourceToString(source)}
          </Span>
        </div>
      </div>
    </Link>
  );
};

export default BookCover;
