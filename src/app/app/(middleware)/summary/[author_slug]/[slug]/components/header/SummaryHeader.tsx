import React from "react";
import Link from "next/link";
import { sourceToString } from "@/utils/topics";
import Span from "@/components/typography/span";
import H1 from "@/components/typography/h1";
import H3Span from "@/components/typography/h3AsSpan";
import { getAuthorFromSummaryId } from "@/actions/authors";
import { getTopicFromSummaryId } from "@/actions/topics";
import { Tables } from "@/types/supabase";

const SummaryHeader = async ({ summary }: { summary: Tables<"summaries"> }) => {
  const author = await getAuthorFromSummaryId(summary?.id);
  const topic = await getTopicFromSummaryId(summary?.id);
  const topic_slug = topic?.slug;

  return (
    <div className="flex flex-col gap-2">
      <Span primaryColor>
        <Link href={`/app/topic/${topic_slug}`} className="hover:underline">
          {topic?.name}
        </Link>{" "}
        • {sourceToString(summary?.source_type)}
      </Span>
      <H1>{summary?.title}</H1>
      <H3Span muted>Par {author?.name}</H3Span>
    </div>
  );
};

export default SummaryHeader;
