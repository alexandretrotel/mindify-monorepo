import React from "react";
import Link from "next/link";
import H3Span from "@/components/typography/h3AsSpan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookCover from "@/components/global/BookCover";
import type { UUID } from "crypto";
import { getUserReadSummaries, getUserSavedSummaries } from "@/actions/users";

const LibrarySnippet = async ({ profileId }: { profileId: UUID }) => {
  const profileReadsSummaries = await getUserReadSummaries(profileId);
  const profileSavedSummaries = await getUserSavedSummaries(profileId);

  return (
    <Tabs defaultValue="reads">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-8">
          <TabsList>
            <TabsTrigger value="reads">Lus</TabsTrigger>
            <TabsTrigger value="saved">Enregistrés</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="reads" className="w-full">
          {profileReadsSummaries.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {profileReadsSummaries?.map((summary) => {
                return (
                  <Link
                    key={summary.id}
                    href={`/summary/${summary.author_slug}/${summary.slug}`}
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
                );
              })}
            </div>
          ) : (
            <div className="flex h-72 flex-col items-center justify-center gap-4 text-center">
              <H3Span>Aucun résumé</H3Span>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          {profileSavedSummaries.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {profileSavedSummaries?.map((summary) => {
                return (
                  <Link
                    key={summary.id}
                    href={`/summary/${summary.author_slug}/${summary.slug}`}
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
                );
              })}
            </div>
          ) : (
            <div className="flex h-72 flex-col items-center justify-center gap-4 text-center">
              <H3Span>Aucun résumé</H3Span>
            </div>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default LibrarySnippet;
