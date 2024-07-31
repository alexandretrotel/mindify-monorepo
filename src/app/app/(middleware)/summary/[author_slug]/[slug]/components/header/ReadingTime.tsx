import React from "react";
import { ClockIcon } from "lucide-react";
import { Muted } from "@/components/typography/muted";

const ReadingTime = async ({ summaryReadingTime }: { summaryReadingTime: number | undefined }) => {
  if (!summaryReadingTime) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <ClockIcon className="h-4 w-4 text-muted-foreground" />{" "}
      <Muted>Temps de lecture : {summaryReadingTime} minutes</Muted>
    </div>
  );
};

export default ReadingTime;
