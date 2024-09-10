import React from "react";
import H3Span from "@/components/typography/h3AsSpan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UUID } from "crypto";
import { getUserReadSummaries, getUserSavedSummaries } from "@/actions/users.action";
import LibrarySnippetClient from "@/components/features/profile/summaries/client/LibrarySnippetClient";

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
            <LibrarySnippetClient summaries={profileReadsSummaries} />
          ) : (
            <div className="flex h-72 flex-col items-center justify-center gap-4 text-center">
              <H3Span>Aucun résumé</H3Span>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          {profileSavedSummaries.length > 0 ? (
            <LibrarySnippetClient summaries={profileSavedSummaries} />
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
