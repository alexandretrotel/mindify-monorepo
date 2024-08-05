import SummariesByTopic from "@/app/app/(middleware)/topic/[slug]/components/SummariesByTopic";
import AccountDropdown from "@/components/global/AccountDropdown";
import H3 from "@/components/typography/h3";
import { Badge } from "@/components/ui/badge";
import { supabaseDefaultClient } from "@/utils/supabase/default";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import SummariesByTopicSkeleton from "@/app/app/(middleware)/topic/[slug]/components/skeleton/SummariesByTopicSkeleton";
import { createClient } from "@/utils/supabase/server";
import { getAdminTopicFromTopicSlug, getTopicFromTopicSlug } from "@/actions/topics";
import type { Tables } from "@/types/supabase";
import { Muted } from "@/components/typography/muted";
import type { Metadata, ResolvingMetadata } from "next";

export const revalidate = 60;

export async function generateMetadata(
  {
    params
  }: {
    params: { slug: string };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;

  const topic = await getAdminTopicFromTopicSlug(slug);

  return {
    title: `${topic?.name} | Mindify`,
    openGraph: {
      title: `${topic?.name} | Mindify`,
      description: `Explorez notre collection des meilleurs résumés dans la catégorie ${topic?.name.toLowerCase()}.`,
      siteName: "Mindify",
      url: `https://mindify.vercel.app/app/topic/${slug}`
    },
    twitter: {
      title: `${topic?.name} | Mindify`,
      card: "summary_large_image",
      description: `Explorez notre collection des meilleurs résumés dans la catégorie ${topic?.name.toLowerCase()}.`,
      images: [
        {
          url: "/open-graph/og-image.png"
        }
      ]
    }
  };
}

export async function generateStaticParams() {
  const { data: topicsData } = await supabaseDefaultClient.from("topics").select("*");

  if (!topicsData) {
    notFound();
  }

  return topicsData?.map((topic) => ({
    slug: topic?.slug
  }));
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const supabase = createClient();

  const topic = await getTopicFromTopicSlug(slug);
  const { data: summariesData } = await supabase
    .from("summaries")
    .select("*, topics(*), authors(*)");

  const filteredSummariesData = summariesData?.filter((summary) => summary?.topics?.slug === slug);

  const numberOfSummaries = filteredSummariesData?.length as number;
  const summariesByTopic = filteredSummariesData?.map((summary) => ({
    ...summary,
    topic: summary?.topics,
    author_slug: summary?.authors?.slug
  }));

  return (
    <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-6 md:gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <H3>{topic.name}</H3>
                <Badge>
                  {numberOfSummaries} {numberOfSummaries > 1 ? "résumés" : "résumé"}
                </Badge>
              </div>
              <Muted>
                Explorez notre collection des meilleurs résumés dans la catégorie{" "}
                {topic?.name?.toLowerCase()}.
              </Muted>
            </div>

            <AccountDropdown />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Suspense fallback={<SummariesByTopicSkeleton />}>
            <SummariesByTopic
              topic={topic}
              summariesByTopic={summariesByTopic as Tables<"summaries">[]}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
