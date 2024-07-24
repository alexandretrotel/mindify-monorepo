import SummariesByCategory from "@/components/(application)/topic/[slug]/summariesByCategory";
import TypographyH2 from "@/components/typography/h2";
import TypographyP from "@/components/typography/p";
import type { Summaries } from "@/types/summary/summary";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

const summaries: Summaries = Array.from({ length: 10 }).map((_, index) => ({
  id: index,
  title: "The Lean Startup",
  author: "Eric Ries",
  image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  created_at: new Date(),
  slug: "the-lean-startup"
})) as Summaries;

const Topic = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const supabase = createClient();

  const { data: topics } = await supabase.from("topics").select("*");

  if (!topics) {
    redirect("/");
  }

  const topic = topics?.find((topic) => topic.slug === slug);

  if (!topic) {
    redirect("/");
  }

  return (
    <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-8 lg:py-12">
      <div className="flex flex-col">
        <TypographyH2>{topic.name}</TypographyH2>
        <TypographyP muted>
          Explorez notre collection des meilleurs livres dans la catégorie{" "}
          {topic?.name?.toLowerCase()}.
        </TypographyP>
      </div>

      <div className="flex flex-col gap-4">
        <SummariesByCategory topic={topic} summaries={summaries} />
      </div>
    </div>
  );
};

export default Topic;
