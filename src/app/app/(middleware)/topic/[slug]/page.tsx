import SummariesByTopic from "@/app/app/(middleware)/topic/[slug]/components/SummariesByTopic";
import AccountDropdown from "@/components/global/AccountDropdown";
import TypographyH3 from "@/components/typography/h3";
import { Badge } from "@/components/ui/badge";
import { supabaseDefaultClient } from "@/utils/supabase/default";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import SummariesByTopicSkeleton from "@/app/app/(middleware)/topic/[slug]/components/skeleton/SummariesByTopicSkeleton";
import TypographySpan from "@/components/typography/span";
import type { Topic, Topics } from "@/types/topics";
import { createClient } from "@/utils/supabase/server";
import type { Summaries } from "@/types/summary";

export const revalidate = 60;

export async function generateStaticParams() {
  const { data: topicsData } = await supabaseDefaultClient.from("topics").select("*");
  const topics: Topics = topicsData as Topics;

  return topics?.map((topic) => ({
    slug: topic?.slug
  }));
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/app/login");
  }

  const { data: summariesData } = await supabase
    .from("summaries")
    .select("*, topics:topics(*), filter:topics(slug), authors(*)")
    .eq("filter.slug", slug);

  const filteredSummariesData = summariesData?.filter((summary) => summary?.topics);

  const topic: Topic = filteredSummariesData?.[0]?.topics as Topic;
  const numberOfSummaries = filteredSummariesData?.length as number;
  const summariesByTopic: Summaries = filteredSummariesData?.map((summary) => ({
    ...summary,
    topic: summary?.topics,
    author_slug: summary?.authors?.slug
  })) as Summaries;

  return (
    <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-6 md:gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <TypographyH3>{topic.name}</TypographyH3>
                <Badge>
                  {numberOfSummaries} {numberOfSummaries > 1 ? "résumés" : "résumé"}
                </Badge>
              </div>
              <TypographySpan muted>
                Explorez notre collection des meilleurs résumés dans la catégorie{" "}
                {topic?.name?.toLowerCase()}.
              </TypographySpan>
            </div>

            <AccountDropdown />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Suspense fallback={<SummariesByTopicSkeleton />}>
            <SummariesByTopic topic={topic} summariesByTopic={summariesByTopic} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
