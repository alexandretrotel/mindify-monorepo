import React, { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import AccountDropdown from "@/components/global/AccountDropdown";
import AddToLibraryButton from "@/app/app/summary/[author_slug]/[slug]/components/buttons/AddToLibraryButton";
import MarkAsReadButton from "@/app/app/summary/[author_slug]/[slug]/components/buttons/MarkAsReadButton";
import SummaryHeader from "@/app/app/summary/[author_slug]/[slug]/components/header/SummaryHeader";
import SummaryHeaderSkeleton from "@/app/app/summary/[author_slug]/[slug]/components/header/skeleton/SummaryHeaderSkeleton";
import { getAdminSummaryFromSlugs, getSummaryFromSlugs } from "@/actions/summaries";
import AuthorDescription from "@/app/app/summary/[author_slug]/[slug]/components/author/AuthorDescription";
import AuthorDescriptionSkeleton from "./components/author/skeleton/AuthorDescriptionSkeleton";
import TableOfContents from "@/app/app/summary/[author_slug]/[slug]/components/table-of-contents/TableOfContents";
import Chapters from "@/app/app/summary/[author_slug]/[slug]/components/chapters/Chapters";
import TableOfContentsSkeleton from "@/app/app/summary/[author_slug]/[slug]/components/table-of-contents/skeleton/TableOfContentsSkeleton";
import ChaptersSkeleton from "@/app/app/summary/[author_slug]/[slug]/components/chapters/skeleton/ChaptersSkeleton";
import Suggestions from "@/app/app/summary/[author_slug]/[slug]/components/suggestions/Suggestions";
import SuggestionsSkeleton from "@/app/app/summary/[author_slug]/[slug]/components/suggestions/skeleton/SuggestionsSkeleton";
import ReadingTime from "@/app/app/summary/[author_slug]/[slug]/components/header/ReadingTime";
import Source from "@/app/app/summary/[author_slug]/[slug]/components/header/Source";
import SummaryMinds from "@/app/app/summary/[author_slug]/[slug]/components/minds/SummaryMinds";
import SummaryMindsSkeleton from "@/app/app/summary/[author_slug]/[slug]/components/minds/skeleton/SummaryMindsSkeleton";
import AddToLibraryButtonSkeleton from "@/app/app/summary/[author_slug]/[slug]/components/buttons/skeleton/AddToLibraryButtonSkeleton";
import MarkAsReadButtonSkeleton from "@/app/app/summary/[author_slug]/[slug]/components/buttons/skeleton/MarkAsReadButtonSkeleton";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";
import { UserMetadata } from "@supabase/supabase-js";

export async function generateMetadata({
  params
}: {
  params: { author_slug: string; slug: string };
}): Promise<Metadata> {
  const { slug, author_slug } = params;

  const summary = await getAdminSummaryFromSlugs(author_slug, slug);

  let title;
  if (summary?.source_type === "book") {
    title = `${summary?.title} - ${summary?.authors?.name} | Mindify`;
  } else {
    title = `${summary?.title} | Mindify`;
  }

  return {
    title,
    openGraph: {
      title: `${summary?.title} | Mindify`,
      description: summary?.introduction?.slice(0, 200) + "...",
      images: [
        {
          url: summary?.image_url ?? "/open-graph/og-image.png"
        }
      ],
      siteName: "Mindify",
      url: `https://mindify.vercel.app/app/summary/${author_slug}/${slug}`
    },
    twitter: {
      title: `${summary?.title} | Mindify`,
      card: "summary_large_image",
      description: summary?.introduction?.slice(0, 200) + "...",
      images: [
        {
          url: summary?.image_url ?? "/open-graph/og-image.png"
        }
      ]
    }
  };
}

const Page = async ({ params }: { params: { author_slug: string; slug: string } }) => {
  const { slug, author_slug } = params;

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const userId = data?.user?.id as UUID;
  const userMetadata = data?.user?.user_metadata as UserMetadata;

  const summary = await getSummaryFromSlugs(author_slug, slug);

  if (!summary) {
    notFound();
  }

  return (
    <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-6 md:gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <Suspense fallback={<SummaryHeaderSkeleton />}>
                  <SummaryHeader summary={summary} />
                </Suspense>

                <AccountDropdown userId={userId} userMetadata={userMetadata} />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Suspense fallback={<AddToLibraryButtonSkeleton />}>
                    <AddToLibraryButton summaryId={summary?.id} userId={userId} />
                  </Suspense>
                  <Source summarySourceUrl={summary?.source_url as string} />
                </div>

                <ReadingTime summaryReadingTime={summary?.reading_time as number} />
              </div>
            </div>

            <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:gap-16">
              <div className="order-2 flex max-w-3xl flex-col gap-8 lg:order-1 lg:min-w-0 lg:grow">
                <Suspense fallback={<ChaptersSkeleton />}>
                  <Chapters summaryId={summary?.id} summary={summary} />
                </Suspense>

                <div className="flex flex-col gap-4">
                  <div className="w-full md:w-fit">
                    <Suspense fallback={<MarkAsReadButtonSkeleton />}>
                      <MarkAsReadButton summaryId={summary?.id} userId={userId} />
                    </Suspense>
                  </div>
                </div>
              </div>

              <div className="relative order-1 w-full lg:order-2">
                <div className="w-full lg:sticky lg:right-0 lg:top-0 lg:pt-8">
                  <div className="flex w-full flex-col gap-8">
                    <Suspense fallback={<TableOfContentsSkeleton />}>
                      <TableOfContents summaryId={summary?.id} />
                    </Suspense>

                    <Suspense fallback={<AuthorDescriptionSkeleton />}>
                      <AuthorDescription summaryId={summary?.id} />
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <Suspense fallback={<SummaryMindsSkeleton />}>
              <SummaryMinds summaryId={summary?.id} userId={userId} />
            </Suspense>

            <Suspense fallback={<SuggestionsSkeleton />}>
              <Suggestions topicId={summary?.topic_id} summary={summary} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
