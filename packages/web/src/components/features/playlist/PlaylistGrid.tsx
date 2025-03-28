import { areMindsSaved } from "@/actions/minds.action";
import { getMindsFromPlaylistSlug } from "@/actions/playlists.action";
import Mind from "@/components/global/Mind";
import H2 from "@/components/typography/h2";
import H3Span from "@/components/typography/h3AsSpan";
import type { Tables } from "@/types/supabase";
import type { UUID } from "crypto";
import { notFound } from "next/navigation";
import React from "react";

const PlaylistGrid = async ({
  playlistSlug,
  isConnected,
  userId,
  userName
}: {
  playlistSlug: string;
  isConnected: boolean;
  userId: UUID;
  userName: string;
}) => {
  const playlist = await getMindsFromPlaylistSlug(playlistSlug);

  if (!playlist) {
    notFound();
  }

  const playlistMinds = playlist?.minds as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  })[];

  if (playlistMinds?.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center">
        <H3Span>Pas de MINDS dans cette playlist.</H3Span>
      </div>
    );
  }

  const playlistMindsIds = playlistMinds?.map((mind) => mind?.id);

  let areMindsSavedArray = Array<boolean>(playlistMindsIds.length).fill(false);
  if (isConnected) {
    areMindsSavedArray = await areMindsSaved(playlistMindsIds, userId);
  }

  return (
    <div className="flex flex-col gap-4">
      <H2>{playlist?.title}</H2>

      <div className="grid gap-4 md:grid-cols-2">
        {playlistMinds?.map((mind, index) => {
          return (
            <Mind
              key={mind.id}
              mind={mind}
              isConnected={isConnected}
              userId={userId}
              userName={userName}
              initialIsSaved={areMindsSavedArray[index]}
              heightFull
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlaylistGrid;
