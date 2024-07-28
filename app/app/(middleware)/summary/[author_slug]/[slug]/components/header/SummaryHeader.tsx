import React from "react";
import Link from "next/link";
import { sourceToString } from "@/utils/topics";
import TypographySpan from "@/components/typography/span";
import TypographyH1 from "@/components/typography/h1";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { getAuthorFromSummaryId } from "@/actions/authors";
import { getTopicFromSummaryId } from "@/actions/topics";
import type { Summary } from "@/types/summary/summary";

const SummaryHeader = async ({ summary }: { summary: Summary }) => {
  const author = await getAuthorFromSummaryId(summary.id);
  const topic = await getTopicFromSummaryId(summary.id);
  const topic_slug = topic?.slug;

  return (
    <div className="flex flex-col gap-2">
      <TypographySpan isPrimaryColor>
        <Link href={`/app/topic/${topic_slug}`} className="hover:underline">
          {topic?.name}
        </Link>{" "}
        • {sourceToString(summary?.source_type)}
      </TypographySpan>
      <TypographyH1>{summary?.title}</TypographyH1>
      <TypographyH3AsSpan muted>Par {author?.name}</TypographyH3AsSpan>
    </div>
  );
};

export default SummaryHeader;
