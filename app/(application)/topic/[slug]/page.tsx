import SummariesByCategory from "@/components/(application)/topic/[slug]/summariesByCategory";
import AccountDropdown from "@/components/global/accountDropdown";
import TypographyH3 from "@/components/typography/h3";
import TypographyP from "@/components/typography/p";
import { Badge } from "@/components/ui/badge";
import type { Summaries } from "@/types/summary/summary";
import type { UserTopics } from "@/types/topics/topics";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
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

  const { data: userTopics } = await supabase.from("user_topics").select("*").eq("user_id", userId);

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
                Explorez notre collection des meilleurs livres dans la catégorie{" "}
                {topic?.name?.toLowerCase()}.
              </TypographyP>
            </div>

            <AccountDropdown
              userMetadata={userMetadata}
              userId={userId}
              topics={topics}
              userTopics={userTopics as UserTopics}
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
