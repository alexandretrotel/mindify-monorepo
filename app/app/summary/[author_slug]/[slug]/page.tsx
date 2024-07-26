import React from "react";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import AccountDropdown from "@/components/global/accountDropdown";
import TypographyH1 from "@/components/typography/h1";
import type { Author, Authors, Summary, SummaryChapter } from "@/types/summary/summary";
import type { Topics } from "@/types/topics/topics";
import TypographySpan from "@/components/typography/span";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRightIcon, ChevronDownIcon, ClockIcon } from "lucide-react";
import { sourceToString } from "@/utils/topics";
import TypographyH2 from "@/components/typography/h2";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import type { UserLibrary, UserReads } from "@/types/user";
import AddToLibraryButton from "@/components/(application)/summary/[author_slug]/[slug]/addToLibraryButton";
import MarkAsReadButton from "@/components/(application)/summary/[author_slug]/[slug]/markAsReadButton";

const Page = async ({ params }: { params: { author_slug: string; slug: string } }) => {
  const { slug, author_slug } = params;

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

  const { data: userTopicsData } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", userId);
  const userTopics = userTopicsData?.flatMap((data) => data?.topics);

  const { data: authorsData } = await supabase.from("authors").select("*");
  const authors: Authors = authorsData as Authors;
  const author: Author = authors.find((author) => author.slug === author_slug) as Author;

  const { data: summaryData } = await supabase
    .from("summaries")
    .select("*")
    .eq("slug", slug)
    .single();
  const summary = {
    ...summaryData,
    topic: topics?.find((topic) => topic.id === summaryData.topic_id)?.name
  } as Summary;

  const { data: summaryChaptersData } = await supabase
    .from("summary_chapters")
    .select("*")
    .eq("summary_id", summary.id)
    .single();
  const summaryChapter: SummaryChapter = summaryChaptersData as SummaryChapter;

  const { data: userReadsData } = await supabase
    .from("user_reads")
    .select("*")
    .eq("user_id", userId);
  const userReads: UserReads = userReadsData as UserReads;

  const { data: userLibraryData } = await supabase
    .from("user_library")
    .select("*")
    .eq("user_id", userId);
  const userLibrary: UserLibrary = userLibraryData as UserLibrary;

  const isSummarySaved: boolean = userLibrary.some((library) => library.summary_id === summary.id);
  const isSummaryRead: boolean = userReads.some((read) => read.summary_id === summary.id);

  return (
    <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-6 md:gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <TypographySpan isPrimaryColor>
                  {summary.topic} • {sourceToString(summary.source_type)}
                </TypographySpan>
                <TypographyH1>{summary.title}</TypographyH1>
                <TypographyH3AsSpan muted>Par {author.name}</TypographyH3AsSpan>
              </div>

              <AccountDropdown
                userMetadata={userMetadata}
                userId={userId}
                topics={topics}
                userTopics={userTopics as Topics}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AddToLibraryButton
                  userId={userId}
                  summaryId={summary.id}
                  isSummarySaved={isSummarySaved}
                />

                {summary.source_url && (
                  <Button variant="link" className="text-muted-foreground" asChild>
                    <Link href={summary.source_url} target="_blank">
                      Voir l&apos;original
                      <ArrowUpRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>

              {!!summary.reading_time && (
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />{" "}
                  <TypographySpan muted>
                    Temps de lecture : {summary.reading_time} minutes
                  </TypographySpan>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:gap-16">
            <div className="order-2 flex max-w-3xl flex-col gap-8 lg:order-1 lg:min-w-0 lg:grow">
              <div id="introduction" className="flex flex-col gap-4">
                <TypographyH2>Introduction</TypographyH2>
                <TypographySpan isDefaultColor>{summary.introduction}</TypographySpan>
              </div>

              <div className="flex flex-col gap-8">
                {summaryChapter?.titles?.map((title, index) => (
                  <div
                    key={title}
                    id={"chapter" + String(index + 1)}
                    className="flex flex-col gap-4"
                  >
                    <TypographyH2>{title}</TypographyH2>
                    <TypographySpan isDefaultColor>{summaryChapter.texts[index]}</TypographySpan>
                  </div>
                ))}
              </div>

              <div id="conclusion" className="flex flex-col gap-4">
                <TypographyH2>Conclusion</TypographyH2>
                <TypographySpan isDefaultColor>{summary.conclusion}</TypographySpan>
              </div>

              <div className="flex flex-col gap-4">
                <div className="w-full md:w-fit">
                  <MarkAsReadButton
                    isSummaryRead={isSummaryRead}
                    userId={userId}
                    summaryId={summary.id}
                  />
                </div>
              </div>
            </div>

            <div className="relative order-1 w-full lg:order-2">
              <div className="w-full lg:sticky lg:right-0 lg:top-0 lg:pt-8">
                <div className="flex w-full flex-col gap-8">
                  <Card>
                    <Collapsible defaultOpen>
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="w-full">
                          <div className="flex w-full items-center justify-between gap-4">
                            <TypographyH3AsSpan>Table des matières</TypographyH3AsSpan>
                            <ChevronDownIcon className="h-5 w-5" />
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent>
                          <ul className="flex flex-col gap-2">
                            <li>
                              <Link
                                href="#introduction"
                                className="text-sm text-primary hover:underline"
                              >
                                1. Introduction
                              </Link>
                            </li>
                            {summaryChapter?.titles?.map((title, index) => (
                              <li key={title}>
                                <Link
                                  href={"#chapter" + String(index + 1)}
                                  className="text-sm text-primary hover:underline"
                                >
                                  {index + 2}. {title}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link
                                href="#conclusion"
                                className="text-sm text-primary hover:underline"
                              >
                                {summaryChapter?.titles?.length
                                  ? summaryChapter?.titles?.length + 2
                                  : 2}
                                . Conclusion
                              </Link>
                            </li>
                          </ul>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  <Card>
                    <Collapsible>
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="w-full">
                          <div className="flex w-full items-center justify-between gap-4">
                            <TypographyH3AsSpan>À propos de l&apos;auteur</TypographyH3AsSpan>
                            <ChevronDownIcon className="h-5 w-5" />
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent>
                          <TypographySpan isDefaultColor>
                            {author.description ?? "Aucune description disponible."}
                          </TypographySpan>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
