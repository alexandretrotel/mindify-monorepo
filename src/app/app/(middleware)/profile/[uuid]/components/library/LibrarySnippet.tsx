import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import BookCover from "@/components/global/BookCover";
import type { UUID } from "crypto";
import { createClient } from "@/utils/supabase/server";
import type { Authors, Summaries } from "@/types/summary";
import type { Topics } from "@/types/topics";
import type { UserLibrary, UserReads } from "@/types/user";

const LibrarySnippet = async ({ profileId }: { profileId: UUID }) => {
  const supabase = createClient();

  const { data: topicsData } = await supabase.from("topics").select("*");
  const topics: Topics = topicsData as Topics;

  const { data: profileReadsData } = await supabase
    .from("user_reads")
    .select("*")
    .eq("user_id", profileId);
  const profileReads: UserReads = profileReadsData as UserReads;

  const { data: profileLibraryData } = await supabase
    .from("user_library")
    .select("*")
    .eq("user_id", profileId);
  const profileLibrary: UserLibrary = profileLibraryData as UserLibrary;

  const readSummaryIds = profileReads?.map((profileRead) => profileRead.summary_id) ?? [];
  const savedSummaryIds = profileLibrary?.map((profileLibrary) => profileLibrary.summary_id) ?? [];

  const { data: authorsData } = await supabase.from("authors").select("*");
  const authors: Authors = authorsData as Authors;

  const { data: summariesData } = await supabase.from("summaries").select("*");
  const summaries: Summaries = summariesData?.map((summary) => ({
    ...summary,
    topic: topics?.find((topic) => topic.id === summary.topic_id)?.name,
    author_slug: authors?.find((author) => author.id === summary.author_id)?.slug
  })) as Summaries;

  const profileReadsSummaries = summaries?.filter((summary) => readSummaryIds.includes(summary.id));
  const profileLibrarySummaries = summaries?.filter((summary) =>
    savedSummaryIds.includes(summary.id)
  );

  return (
    <Tabs defaultValue="reads">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-8">
          <TabsList>
            <TabsTrigger value="reads">Résumés lus</TabsTrigger>
            <TabsTrigger value="saved">Enregistrés</TabsTrigger>
          </TabsList>

          {profileReadsSummaries?.length > 0 ||
            (profileLibrarySummaries?.length > 0 && (
              <Button variant="outline" asChild>
                <Link href={`/app/profile/${profileId}/summaries`} className="flex items-center">
                  Voir tout
                </Link>
              </Button>
            ))}
        </div>

        <TabsContent value="reads" className="w-full">
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: "auto"
            }}
            className="w-full"
          >
            {profileReadsSummaries.length > 0 ? (
              <CarouselContent className="-ml-4">
                {profileReadsSummaries?.map((summary) => {
                  return (
                    <CarouselItem key={summary.id} className="basis-1/2 pl-4 md:basis-1/3">
                      <Link
                        href={`/app/summary/${summary.author_slug}/${summary.slug}`}
                        className="h-full"
                      >
                        <BookCover
                          title={summary.title}
                          author={summary.author}
                          category={summary.topic}
                          source={summary.source_type}
                        />
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
                <TypographyH3AsSpan>Aucun résumé</TypographyH3AsSpan>
              </div>
            )}
          </Carousel>
        </TabsContent>

        <TabsContent value="saved">
          <Carousel opts={{ align: "start", slidesToScroll: "auto" }} className="w-full">
            {profileLibrarySummaries.length > 0 ? (
              <CarouselContent className="-ml-4">
                {profileLibrarySummaries?.map((summary) => {
                  return (
                    <CarouselItem key={summary.id} className="basis-1/2 pl-4 md:basis-1/3">
                      <Link
                        href={`/app/summary/${summary.author_slug}/${summary.slug}`}
                        className="h-full"
                      >
                        <BookCover
                          title={summary.title}
                          author={summary.author}
                          category={summary.topic}
                          source={summary.source_type}
                        />
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
                <TypographyH3AsSpan>Aucun résumé</TypographyH3AsSpan>
              </div>
            )}
          </Carousel>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default LibrarySnippet;
