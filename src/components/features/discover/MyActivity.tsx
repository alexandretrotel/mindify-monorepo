import React from "react";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import H3 from "@/components/typography/h3";
import { CardDescription, CardTitle } from "@/components/ui/card";

const MyActivity = async ({ userId }: { userId: UUID }) => {
  const supabase = createClient();

  const { data: userReadsData } = await supabase
    .from("read_summaries")
    .select("*, summaries(*)")
    .eq("user_id", userId);

  const userReads = userReadsData;
  const summaries = userReadsData?.map((item) => item?.summaries);

  const summariesRead = userReads?.length ?? 0;

  const totalReadingTime =
    userReads?.reduce((acc, read) => {
      const summary = summaries?.find((summary) => summary?.id === read?.summary_id);
      return acc + (summary?.reading_time ?? 0);
    }, 0) ?? 0;
  const totalReadingTimeInMinutes = Math.floor(totalReadingTime % 60);
  const totalReadingTimeInHours = Math.floor((totalReadingTime - totalReadingTimeInMinutes) / 60);
  const remainingMinutes = totalReadingTime % 60;

  return (
    <div className="flex flex-col gap-4 md:hidden">
      <H3>Mon activité</H3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 rounded-lg border p-6">
          <div className="space-y-0 lg:pb-2">
            <CardDescription>{summariesRead > 1 ? "Résumés lus" : "Résumé lu"}</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              {summariesRead}{" "}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                {summariesRead > 1 ? "résumés" : "résumé"}
              </span>
            </CardTitle>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border">
          <div className="space-y-0 p-6 lg:pb-2">
            <CardDescription>Temps de lecture</CardDescription>
            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
              {totalReadingTimeInHours > 0 && (
                <React.Fragment>
                  {totalReadingTimeInHours}
                  <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                    h
                  </span>
                </React.Fragment>
              )}
              {remainingMinutes}
              <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                {remainingMinutes > 1 ? "mins" : "min"}
              </span>
            </CardTitle>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyActivity;
