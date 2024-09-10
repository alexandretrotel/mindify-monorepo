import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import AddToLibraryButton from "@/components/features/summary/buttons/AddToLibraryButton";
import MarkAsReadButton from "@/components/features/summary/buttons/MarkAsReadButton";
import SummaryHeader from "@/components/features/summary/header/SummaryHeader";
import SummaryHeaderSkeleton from "@/components/features/summary/header/skeleton/SummaryHeaderSkeleton";
import { getAdminSummaryFromSlugs, getSummaryFromSlugs } from "@/actions/summaries.action";
import AuthorDescription from "@/components/features/summary/author/AuthorDescription";
import AuthorDescriptionSkeleton from "@/components/features/summary/author/skeleton/AuthorDescriptionSkeleton";
import TableOfContents from "@/components/features/summary/table-of-contents/TableOfContents";
import Chapters from "@/components/features/summary/chapters/Chapters";
import TableOfContentsSkeleton from "@/components/features/summary/table-of-contents/skeleton/TableOfContentsSkeleton";
import ChaptersSkeleton from "@/components/features/summary/chapters/skeleton/ChaptersSkeleton";
import Suggestions from "@/components/features/summary/suggestions/Suggestions";
import SuggestionsSkeleton from "@/components/features/summary/suggestions/skeleton/SuggestionsSkeleton";
import Source from "@/components/features/summary/header/Source";
import AddToLibraryButtonSkeleton from "@/components/features/summary/buttons/skeleton/AddToLibraryButtonSkeleton";
import MarkAsReadButtonSkeleton from "@/components/features/summary/buttons/skeleton/MarkAsReadButtonSkeleton";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import BorderTabs from "@/components/global/BorderTabs";
import AuthorDescriptionMobile from "@/components/features/summary/author/AuthorDescriptionMobile";
import AuthorDescriptionMobileSkeleton from "@/components/features/summary/author/skeleton/AuthorDescriptionMobileSkeleton";
import TableOfContentsMobile from "@/components/features/summary/table-of-contents/TableOfContentsMobile";
import TableOfContentsMobileSkeleton from "@/components/features/summary/table-of-contents/skeleton/TableOfContentsMobileSkeleton";
import FlashcardFullscreen from "@/components/features/summary/flashcards/FlashcardFullscreen";
import FlashcardsButton from "@/components/features/summary/header/FlashcardsButton";
import H2 from "@/components/typography/h2";
import { Muted } from "@/components/typography/muted";
import P from "@/components/typography/p";
import { Separator } from "@/components/ui/separator";

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
      url: `https://mindify.fr/summary/${author_slug}/${slug}`
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
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isConnected = !!user;

  const userId = user?.id as UUID;
  const userName = user?.user_metadata?.name as string;

  const summary = (await getSummaryFromSlugs(author_slug, slug)) as Tables<"summaries"> & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
    chapters: Tables<"chapters">;
  };

  if (!summary) {
    notFound();
  }

  return (
    <React.Fragment>
      <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-6 md:gap-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Suspense fallback={<SummaryHeaderSkeleton />}>
                    <SummaryHeader summary={summary} />
                  </Suspense>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      {isConnected && (
                        <Suspense fallback={<AddToLibraryButtonSkeleton />}>
                          <AddToLibraryButton summaryId={summary?.id} userId={userId} />
                        </Suspense>
                      )}

                      <Source summarySourceUrl={summary?.source_url as string} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 lg:hidden">
                <BorderTabs
                  elements={[
                    { label: "Résumé", value: "summary" },
                    { label: "Auteur", value: "author" },
                    { label: "MINDS", value: "minds" }
                  ]}
                >
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-8">
                      <Suspense fallback={<TableOfContentsMobileSkeleton />}>
                        <TableOfContentsMobile chapters={summary?.chapters} />
                      </Suspense>

                      <Suspense fallback={<ChaptersSkeleton />}>
                        <Chapters
                          chapters={summary?.chapters}
                          introduction={summary?.introduction}
                          conclusion={summary?.conclusion}
                          isConnected={isConnected}
                        />
                      </Suspense>

                      {isConnected && (
                        <div className="flex flex-col gap-4">
                          <div className="w-full md:w-fit">
                            <Suspense fallback={<MarkAsReadButtonSkeleton />}>
                              <MarkAsReadButton summaryId={summary?.id} userId={userId} />
                            </Suspense>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Suspense fallback={<AuthorDescriptionMobileSkeleton />}>
                    <AuthorDescriptionMobile author={summary?.authors} />
                  </Suspense>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <H2>Les MINDS de ce résumé</H2>
                      <Muted size="sm">Lire c&apos;est bien, mais retenir c&apos;est mieux.</Muted>
                      <P>
                        Redécouvre les idées essentielles de ce résumé et enregistre ceux qui
                        t&apos;ont marqué pour les apprendre.
                      </P>
                    </div>
                    <FlashcardsButton pulsate>Je découvre les MINDS</FlashcardsButton>
                  </div>
                </BorderTabs>
              </div>

              <div className="hidden w-full flex-row justify-between gap-16 lg:flex">
                <div className="flex min-w-0 max-w-3xl grow flex-col gap-8">
                  <Suspense fallback={<ChaptersSkeleton />}>
                    <Chapters
                      chapters={summary?.chapters}
                      introduction={summary?.introduction}
                      conclusion={summary?.conclusion}
                      isConnected={isConnected}
                    />
                  </Suspense>

                  {isConnected && (
                    <div className="flex flex-col gap-4">
                      <div className="w-full md:w-fit">
                        <Suspense fallback={<MarkAsReadButtonSkeleton />}>
                          <MarkAsReadButton summaryId={summary?.id} userId={userId} />
                        </Suspense>
                      </div>
                    </div>
                  )}
                </div>

                {isConnected && (
                  <div className="relative w-full lg:max-w-md">
                    <div className="sticky right-0 top-0 w-full pt-8">
                      <div className="flex w-full flex-col gap-8">
                        <Suspense fallback={<TableOfContentsSkeleton />}>
                          <TableOfContents chapters={summary?.chapters} />
                        </Suspense>

                        <Suspense fallback={<AuthorDescriptionSkeleton />}>
                          <AuthorDescription author={summary?.authors} />
                        </Suspense>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="hidden lg:block" />

            {isConnected && (
              <div className="hidden flex-col gap-16 lg:flex">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <H2>Les MINDS de ce résumé</H2>
                    <Muted size="sm">Lire c&apos;est bien, mais retenir c&apos;est mieux.</Muted>
                    <P>
                      Redécouvre les idées essentielles de ce résumé et enregistre ceux qui
                      t&apos;ont marqué pour les apprendre.
                    </P>
                  </div>
                  <FlashcardsButton pulsate>Je découvre les MINDS</FlashcardsButton>
                </div>

                <Suspense fallback={<SuggestionsSkeleton />}>
                  <Suggestions topicId={summary?.topic_id} summary={summary} />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </div>

      <FlashcardFullscreen
        summaryId={summary?.id}
        isConnected={isConnected}
        userId={userId}
        userName={userName}
      />
    </React.Fragment>
  );
};

export default Page;
