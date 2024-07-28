import React from "react";
import { ClockIcon } from "lucide-react";
import TypographySpan from "@/components/typography/span";

const ReadingTime = async ({ summaryReadingTime }: { summaryReadingTime: number | undefined }) => {
  if (!summaryReadingTime) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <ClockIcon className="h-4 w-4 text-muted-foreground" />{" "}
      <TypographySpan muted>Temps de lecture : {summaryReadingTime} minutes</TypographySpan>
    </div>
  );
};

export default ReadingTime;
