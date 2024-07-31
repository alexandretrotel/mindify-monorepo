import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import BookCover from "@/components/global/BookCover";
import type { UUID } from "crypto";
import { getUserReadSummaries, getUserSavedSummaries } from "@/actions/users";

const LibrarySnippet = async ({ profileId }: { profileId: UUID }) => {
  const profileReadsSummaries = await getUserReadSummaries(profileId);
  const profileSavedSummaries = await getUserSavedSummaries(profileId);

  return (
    <Tabs defaultValue="reads">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-8">
          <TabsList>
            <TabsTrigger value="reads">Résumés lus</TabsTrigger>
            <TabsTrigger value="saved">Enregistrés</TabsTrigger>
          </TabsList>

          {profileReadsSummaries?.length > 0 ||
            (profileReadsSummaries?.length > 0 && (
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
                          author={summary.authors.name}
                          category={summary.topic}
                          source={summary.source_type}
                          image={summary.image_url}
                        />
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            ) : (
              <div className="flex h-72 flex-col items-center justify-center gap-4 text-center">
                <TypographyH3AsSpan>Aucun résumé</TypographyH3AsSpan>
              </div>
            )}
          </Carousel>
        </TabsContent>

        <TabsContent value="saved">
          <Carousel opts={{ align: "start", slidesToScroll: "auto" }} className="w-full">
            {profileSavedSummaries.length > 0 ? (
              <CarouselContent className="-ml-4">
                {profileSavedSummaries?.map((summary) => {
                  return (
                    <CarouselItem key={summary.id} className="basis-1/2 pl-4 md:basis-1/3">
                      <Link
                        href={`/app/summary/${summary.author_slug}/${summary.slug}`}
                        className="h-full"
                      >
                        <BookCover
                          title={summary.title}
                          author={summary.authors.name}
                          category={summary.topic}
                          source={summary.source_type}
                          image={summary.image_url}
                        />
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            ) : (
              <div className="flex h-72 flex-col items-center justify-center gap-4 text-center">
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
