import { getSummaryChapters } from "@/actions/summaries";
import React from "react";
import TypographyH2 from "@/components/typography/h2";
import TypographyP from "@/components/typography/p";
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
        <TypographyH2>Introduction</TypographyH2>
        <TypographyP>{summary.introduction}</TypographyP>
      </div>

      <div className="flex flex-col gap-8">
        {summaryChapters?.titles?.map((title, index) => (
          <div key={title} id={"chapter" + String(index + 1)} className="flex flex-col gap-4">
            <TypographyH2>{title}</TypographyH2>
            <TypographyP>{summaryChapters?.texts[index]}</TypographyP>
          </div>
        ))}
      </div>

      <div id="conclusion" className="flex flex-col gap-4">
        <TypographyH2>Conclusion</TypographyH2>
        <TypographyP>{summary.conclusion}</TypographyP>
      </div>
    </>
  );
};

export default Chapters;
