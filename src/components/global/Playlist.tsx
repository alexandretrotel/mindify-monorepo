import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Tables } from "@/types/supabase";

const Playlist = async ({
  playlist,
  heightFull
}: {
  playlist: Tables<"minds_playlists">;
  heightFull?: boolean;
}) => {
  return (
    <div
      key={playlist.id}
      className={`flex flex-col justify-between gap-8 rounded-lg bg-primary p-6 ${heightFull ? "h-full" : ""}`}
    >
      <span className="text-4xl font-semibold text-primary-foreground">{playlist?.title}</span>

      <Button variant="secondary" className="w-fit" asChild>
        <Link href={`/playlist/${playlist.id}`}>Voir la playlist</Link>
      </Button>
    </div>
  );
};

export default Playlist;
