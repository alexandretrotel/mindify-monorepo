import React from "react";
import type { Tables } from "@/types/supabase";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import H5Span from "@/components/typography/h5AsSpan";
import { Muted } from "@/components/typography/muted";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { features } from "@/data/features";
import Span from "@/components/typography/span";
import { sourceToString } from "@/utils/topics";

const ContentCard = ({
  summary
}: {
  summary: Tables<"summaries"> & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
  };
}) => {
  const image = summary.image_url;

  return (
    <div className={`ml-4 w-96 overflow-hidden rounded-lg border bg-card`}>
      {features.summaryImageIsVisible && (
        <React.Fragment>
          {image ? (
            <Image
              src={image}
              fill={true}
              className="h-48 w-full object-cover object-center"
              alt={summary.title}
            />
          ) : (
            <Skeleton className="h-48 w-full rounded-none" />
          )}
        </React.Fragment>
      )}

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col">
          <H5Span>{summary.title}</H5Span>
          {summary.source_type === "book" && <Muted size="sm">{summary.authors.name}</Muted>}
          <Span primaryColor size="xs">
            {summary.topics.name} • {sourceToString(summary.source_type)}
          </Span>
        </div>

        <Button
          variant="outline"
          className="w-full hover:border-transparent hover:bg-primary hover:text-primary-foreground"
          asChild
        >
          <Link href={CTA_URL}>Lire dès maintenant</Link>
        </Button>
      </div>
    </div>
  );
};

export default ContentCard;
