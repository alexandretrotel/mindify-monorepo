import React from "react";
import H2 from "@/components/typography/h2";
import P from "@/components/typography/p";
import type { Tables } from "@/types/supabase";

const Chapters = async ({
  chapters,
  introduction,
  conclusion
}: {
  chapters: Tables<"chapters">;
  introduction: string;
  conclusion: string;
}) => {
  return (
    <React.Fragment>
      <div id="introduction" className="flex flex-col gap-4">
        <H2>Introduction</H2>
        <P size="lg">{introduction}</P>
      </div>

      <div className="flex flex-col gap-8">
        {chapters?.titles?.map((title, index) => (
          <div key={title} id={"chapter" + String(index + 1)} className="flex flex-col gap-4">
            <H2>{title}</H2>
            <P size="lg">{chapters?.texts[index]}</P>
          </div>
        ))}
      </div>

      <div id="conclusion" className="flex flex-col gap-4">
        <H2>Conclusion</H2>
        <P size="lg">{conclusion}</P>
      </div>
    </React.Fragment>
  );
};

export default Chapters;
