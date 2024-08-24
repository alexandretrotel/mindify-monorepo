import { sourceToString } from "@/utils/topics";
import { Tables } from "@/types/supabase";
import Span from "@/components/typography/span";
import Link from "next/link";
import H1 from "@/components/typography/h1";
import H3Span from "@/components/typography/h3AsSpan";

const SummaryHeader = async ({
  summary
}: {
  summary: Tables<"summaries"> & { topics: Tables<"topics">; authors: Tables<"authors"> };
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Span primaryColor>
        <Link href={`/topic/${summary?.topics?.slug}`} className="hover:underline">
          {summary?.topics?.name}
        </Link>{" "}
        • {sourceToString(summary?.source_type)}
      </Span>
      <H1>{summary?.title}</H1>
      <H3Span muted>Par {summary?.authors?.name}</H3Span>
    </div>
  );
};

export default SummaryHeader;
