import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import AccountDropdown from "@/components/global/AccountDropdown";
import AddToLibraryButton from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/buttons/AddToLibraryButton";
import MarkAsReadButton from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/buttons/MarkAsReadButton";
import SummaryHeader from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/header/SummaryHeader";
import SummaryHeaderSkeleton from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/header/skeleton/SummaryHeaderSkeleton";
import { getSummaryFromSlugs } from "@/actions/summaries";
import AuthorDescription from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/author/AuthorDescription";
import AuthorDescriptionSkeleton from "./components/author/skeleton/AuthorDescriptionSkeleton";
import TableOfContents from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/table-of-contents/TableOfContents";
import Chapters from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/chapters/Chapters";
import TableOfContentsSkeleton from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/table-of-contents/skeleton/TableOfContentsSkeleton";
import ChaptersSkeleton from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/chapters/skeleton/ChaptersSkeleton";
import Suggestions from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/suggestions/Suggestions";
import SuggestionsSkeleton from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/suggestions/skeleton/SuggestionsSkeleton";
import ReadingTime from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/header/ReadingTime";
import Source from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/header/Source";
import SummaryMinds from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/minds/SummaryMinds";
import SummaryMindsSkeleton from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/minds/skeleton/SummaryMindsSkeleton";
import AddToLibraryButtonSkeleton from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/buttons/skeleton/AddToLibraryButtonSkeleton";
import MarkAsReadButtonSkeleton from "@/app/app/(middleware)/summary/[author_slug]/[slug]/components/buttons/skeleton/MarkAsReadButtonSkeleton";

const Page = async ({ params }: { params: { author_slug: string; slug: string } }) => {
  const { slug, author_slug } = params;

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

                <AccountDropdown />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Suspense fallback={<AddToLibraryButtonSkeleton />}>
                    <AddToLibraryButton summaryId={summary?.id} />
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
                      <MarkAsReadButton summaryId={summary?.id} />
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
              <SummaryMinds summaryId={summary?.id} />
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
