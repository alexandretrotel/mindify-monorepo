import { getMindsFromPlaylistSlug } from "@/actions/playlists";
import Mind from "@/components/global/Mind";
import type { Tables } from "@/types/supabase";
import type { UUID } from "crypto";
import { notFound } from "next/navigation";
import React from "react";

const PlaylistGrid = async ({
  playlistSlug,
  isConnected,
  userId
}: {
  playlistSlug: string;
  isConnected: boolean;
  userId: UUID;
}) => {
  const playlist = await getMindsFromPlaylistSlug(playlistSlug);

  if (!playlist) {
    notFound();
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {playlist?.minds?.map((mind) => {
        return <Mind key={mind.id} mind={mind} isConnected={isConnected} userId={userId} />;
      })}
    </div>
  );
};

export default PlaylistGrid;
