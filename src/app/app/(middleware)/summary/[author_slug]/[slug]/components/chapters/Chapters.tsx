import { getSummaryChapters } from "@/actions/summaries";
import React from "react";
import H2 from "@/components/typography/h2";
import P from "@/components/typography/p";
import type { Tables } from "@/types/supabase";

const Chapters = async ({
  summaryId,
  summary
}: {
  summaryId: number;
  summary: Tables<"summaries">;
}) => {
  const summaryChapters = await getSummaryChapters(summaryId);

  return (
    <>
      <div id="introduction" className="flex flex-col gap-4">
        <H2>Introduction</H2>
        <P>{summary.introduction}</P>
      </div>

      <div className="flex flex-col gap-8">
        {summaryChapters?.titles?.map((title, index) => (
          <div key={title} id={"chapter" + String(index + 1)} className="flex flex-col gap-4">
            <H2>{title}</H2>
            <P>{summaryChapters?.texts[index]}</P>
          </div>
        ))}
      </div>

      <div id="conclusion" className="flex flex-col gap-4">
        <H2>Conclusion</H2>
        <P>{summary.conclusion}</P>
      </div>
    </>
  );
};

export default Chapters;
