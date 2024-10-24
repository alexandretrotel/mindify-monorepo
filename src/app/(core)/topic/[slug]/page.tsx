import SummariesByTopic from "@/components/features/topic/SummariesByTopic";
import H3 from "@/components/typography/h3";
import React, { Suspense } from "react";
import SummariesByTopicSkeleton from "@/components/features/topic/skeleton/SummariesByTopicSkeleton";
import { createClient } from "@/utils/supabase/server";
import { getAdminTopicFromTopicSlug } from "@/actions/topics.action";
import type { Tables } from "@/types/supabase";
import { Muted } from "@/components/typography/muted";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;

  const topic = await getAdminTopicFromTopicSlug(slug);

  return {
    title: `${topic?.name} | Mindify`,
    openGraph: {
      title: `${topic?.name} | Mindify`,
      description: `Explorez notre collection des meilleurs résumés dans la catégorie ${topic?.name.toLowerCase()}.`,
      siteName: "Mindify",
      url: `https://mindify.fr/topic/${slug}`,
      images: [
        {
          url: "/open-graph/og-image.png"
        }
      ]
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

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { slug } = params;

  const supabase = createClient();

  const { data: summariesData } = await supabase
    .from("summaries")
    .select("*, topics(*), authors(*)");
  const topic = summariesData?.find((summary) => summary?.topics?.slug === slug)?.topics;

  const filteredSummariesData = summariesData?.filter((summary) => summary?.topics?.slug === slug);

  const summariesByTopic = filteredSummariesData?.map((summary) => ({
    ...summary,
    topic: summary?.topics,
    author_slug: summary?.authors?.slug
  }));

  return (
    <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-6 md:gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <H3>{topic?.name}</H3>
            </div>
            <Muted>
              Explorez notre collection des meilleurs résumés dans la catégorie{" "}
              {topic?.name?.toLowerCase()}.
            </Muted>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Suspense fallback={<SummariesByTopicSkeleton />}>
            <SummariesByTopic
              topic={topic as Tables<"topics">}
              summariesByTopic={summariesByTopic as Tables<"summaries">[]}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
