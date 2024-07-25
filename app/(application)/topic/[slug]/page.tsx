import SummariesByCategory from "@/components/(application)/topic/[slug]/summariesByCategory";
import AccountDropdown from "@/components/global/accountDropdown";
import TypographyH3 from "@/components/typography/h3";
import TypographyP from "@/components/typography/p";
import { Badge } from "@/components/ui/badge";
import type { Authors, Summaries } from "@/types/summary/summary";
import type { Topics } from "@/types/topics/topics";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/");
  }

  const userMetadata = data.user.user_metadata;
  const userId = data.user.id as UUID;

  const { data: topics } = await supabase.from("topics").select("*");

  if (!topics) {
    redirect("/");
  }

  const topic = topics?.find((topic) => topic.slug === slug);

  if (!topic) {
    redirect("/");
  }

  const { data: userTopicsData } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", userId);
  const userTopics = userTopicsData?.flatMap((data) => data?.topics) as Topics;

  const { data: authorsData } = await supabase.from("authors").select("*");
  const authors = authorsData as Authors;

  const { data: summariesData } = await supabase
    .from("summaries")
    .select("*")
    .eq("topic_id", topic.id);
  const summaries = summariesData?.map((summary) => ({
    ...summary,
    topic: topics?.find((topic) => topic.id === summary.topic_id)?.name,
    author_slug: authors?.find((author) => author.id === summary.author_id)?.slug
  })) as Summaries;

  return (
    <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-6 md:gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <TypographyH3>{topic.name}</TypographyH3>
                <Badge>{summaries.length} résumés</Badge>
              </div>
              <TypographyP muted>
                Explorez notre collection des meilleurs résumés dans la catégorie{" "}
                {topic?.name?.toLowerCase()}.
              </TypographyP>
            </div>

            <AccountDropdown
              userMetadata={userMetadata}
              userId={userId}
              topics={topics}
              userTopics={userTopics}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SummariesByCategory topic={topic} summaries={summaries} />
        </div>
      </div>
    </div>
  );
};

export default Page;
