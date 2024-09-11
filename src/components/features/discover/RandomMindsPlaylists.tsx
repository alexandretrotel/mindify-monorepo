import React from "react";
import H3 from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import { UUID } from "crypto";
import { getAllRandomMindsPlaylists } from "@/actions/playlists.action";
import MindsPlaylistsClient from "@/components/global/MindsPlaylistsClient";

const RandomMindsPlaylists = async ({
  userId,
  isConnected
}: {
  userId: UUID;
  isConnected: boolean;
}) => {
  const randomMindsPlaylists = await getAllRandomMindsPlaylists();
  const slicedRandomMindsPlaylists = randomMindsPlaylists?.slice(0, 6);

  if (!slicedRandomMindsPlaylists) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <H3>Atteignez vos objectifs</H3>
        <Muted>Les sélections de MINDS qui vous aideront à avancer.</Muted>
      </div>

      <MindsPlaylistsClient
        mindsPlaylists={slicedRandomMindsPlaylists}
        userId={userId}
        isConnected={isConnected}
      />
    </div>
  );
};

export default RandomMindsPlaylists;
