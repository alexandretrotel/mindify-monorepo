import { getSummaryChapters } from "@/actions/summaries";
import React from "react";
import TypographyH2 from "@/components/typography/h2";
import TypographySpan from "@/components/typography/span";
import type { Summary } from "@/types/summary";

const Chapters = async ({ summaryId, summary }: { summaryId: number; summary: Summary }) => {
  const summaryChapters = await getSummaryChapters(summaryId);

  return (
    <>
      <div id="introduction" className="flex flex-col gap-4">
        <TypographyH2>Introduction</TypographyH2>
        <TypographySpan isDefaultColor>{summary.introduction}</TypographySpan>
      </div>

      <div className="flex flex-col gap-8">
        {summaryChapters?.titles?.map((title, index) => (
          <div key={title} id={"chapter" + String(index + 1)} className="flex flex-col gap-4">
            <TypographyH2>{title}</TypographyH2>
            <TypographySpan isDefaultColor>{summaryChapters?.texts[index]}</TypographySpan>
          </div>
        ))}
      </div>

      <div id="conclusion" className="flex flex-col gap-4">
        <TypographyH2>Conclusion</TypographyH2>
        <TypographySpan isDefaultColor>{summary.conclusion}</TypographySpan>
      </div>
    </>
  );
};

export default Chapters;
