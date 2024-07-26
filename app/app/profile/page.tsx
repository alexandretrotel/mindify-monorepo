import AccountDropdown from "@/components/global/accountDropdown";
import BookCover from "@/components/global/bookCover";
import TypographyH2 from "@/components/typography/h2";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyP from "@/components/typography/p";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Summaries } from "@/types/summary/summary";
import type { Topics } from "@/types/topics/topics";
import type { UserLibrary, UserReads } from "@/types/user";
import { createClient } from "@/utils/supabase/server";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import Link from "next/link";
import React from "react";

const Page = async () => {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  const userId: UUID = data?.user?.id as UUID;
  const userMetadata: UserMetadata = data?.user?.user_metadata as UserMetadata;

  const { data: topicsData } = await supabase.from("topics").select("*");
  const topics: Topics = topicsData as Topics;

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

  const readSummaryIds = userReads?.map((userRead) => userRead.summary_id) ?? [];
  const savedSummaryIds = userLibrary?.map((userLibrary) => userLibrary.summary_id) ?? [];

  const { data: summariesData } = await supabase.from("summaries").select("*");
  const summaries: Summaries = summariesData?.map((summary) => ({
    ...summary,
    topic: topics?.find((topic) => topic.id === summary.topic_id)?.name,
    number_of_reads: userReads?.filter((read) => read.summary_id === summary.id).length
  })) as Summaries;

  const userReadsSummaries = summaries?.filter((summary) => readSummaryIds.includes(summary.id));
  const userLibrarySummaries = summaries?.filter((summary) => savedSummaryIds.includes(summary.id));

  return (
    <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-6 md:gap-12">
      <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:gap-16">
        <div className="order-2 flex flex-col gap-8 lg:order-1 lg:min-w-0 lg:grow">
          <div className="flex items-center justify-between gap-8">
            <div className="flex flex-col">
              <TypographyH2>{userMetadata?.name}</TypographyH2>
              <TypographyP size="sm" muted>
                {userMetadata?.biography}
              </TypographyP>
            </div>

            <AccountDropdown
              userMetadata={userMetadata}
              userId={userId}
              topics={topics}
              userTopics={[]}
            />
          </div>

          <div className="max-w-3xl">
            <Tabs defaultValue="reads">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-8">
                  <TabsList>
                    <TabsTrigger value="reads">Résumés lus</TabsTrigger>
                    <TabsTrigger value="saved">Enregistrés</TabsTrigger>
                  </TabsList>

                  <Button variant="outline" asChild>
                    <Link
                      href={`/app/profile/${userMetadata?.id}/summaries`}
                      className="flex items-center"
                    >
                      Voir tout
                    </Link>
                  </Button>
                </div>

                <TabsContent value="reads" className="w-full">
                  <Carousel
                    opts={{
                      align: "start",
                      slidesToScroll: "auto"
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {userReadsSummaries.length > 0 ? (
                        userReadsSummaries?.map((summary) => {
                          return (
                            <CarouselItem key={summary.id} className="basis-1/2 pl-4 md:basis-1/3">
                              <Link href={`/app/summary/${summary.author_slug}/${summary.slug}`}>
                                <BookCover
                                  title={summary.title}
                                  author={summary.author}
                                  category={summary.topic}
                                  source={summary.source_type}
                                />
                              </Link>
                            </CarouselItem>
                          );
                        })
                      ) : (
                        <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
                          <TypographyH3AsSpan>Aucun résumé</TypographyH3AsSpan>
                        </div>
                      )}
                    </CarouselContent>
                  </Carousel>
                </TabsContent>

                <TabsContent value="saved">
                  <Carousel opts={{ align: "start", slidesToScroll: "auto" }} className="w-full">
                    <CarouselContent className="-ml-4">
                      {userLibrarySummaries.length > 0 ? (
                        userLibrarySummaries?.map((summary) => {
                          return (
                            <CarouselItem key={summary.id} className="basis-1/2 pl-4 md:basis-1/3">
                              <Link href={`/app/summary/${summary.author_slug}/${summary.slug}`}>
                                <BookCover
                                  title={summary.title}
                                  author={summary.author}
                                  category={summary.topic}
                                  source={summary.source_type}
                                />
                              </Link>
                            </CarouselItem>
                          );
                        })
                      ) : (
                        <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
                          <TypographyH3AsSpan>Aucun résumé</TypographyH3AsSpan>
                        </div>
                      )}
                    </CarouselContent>
                  </Carousel>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
