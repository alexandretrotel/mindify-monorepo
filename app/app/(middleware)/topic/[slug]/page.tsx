import { countSummariesByTopicId } from "@/actions/summaries";
import { getTopicFromTopicSlug } from "@/actions/topics";
import SummariesByCategory from "@/app/app/(middleware)/topic/[slug]/components/SummariesByCategory";
import AccountDropdown from "@/components/global/accountDropdown";
import TypographyH3 from "@/components/typography/h3";
import TypographyP from "@/components/typography/p";
import { Badge } from "@/components/ui/badge";
import type { Authors, Summaries } from "@/types/summary/summary";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/app/login");
  }

  const topic = await getTopicFromTopicSlug(slug);
  const numberOfSummaries = await countSummariesByTopicId(topic.id);

  return (
    <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-6 md:gap-12">
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
              <TypographyP muted>
                Explorez notre collection des meilleurs résumés dans la catégorie{" "}
                {topic?.name?.toLowerCase()}.
              </TypographyP>
            </div>

            <AccountDropdown />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SummariesByCategory topic={topic} />
        </div>
      </div>
    </div>
  );
};

export default Page;
