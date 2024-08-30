import { getMindsFromPlaylistSlug } from "@/actions/playlists";
import PlaylistGrid from "@/components/features/playlist/PlaylistGrid";
import PlaylistGridSkeleton from "@/components/features/playlist/skeleton/PlaylistGridSkeleton";
import { createClient } from "@/utils/supabase/server";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import type { Metadata, ResolvingMetadata } from "next";
import React, { Suspense } from "react";

export async function generateMetadata(
  {
    params
  }: {
    params: { slug: string };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;

  const playlist = await getMindsFromPlaylistSlug(slug);

  return {
    title: `${playlist?.title} | Mindify`,
    openGraph: {
      title: `${playlist?.title} | Mindify`,
      description: `Découvrez les meilleurs MINDS dans la playlist ${playlist?.title.toLowerCase()}.`,
      siteName: "Mindify",
      url: `https://mindify.fr/playlist/${slug}`,
      images: [
        {
          url: "/open-graph/og-image.png"
        }
      ]
    },
    twitter: {
      title: `${playlist?.title} | Mindify`,
      card: "summary_large_image",
      description: `Découvrez les meilleurs MINDS dans la playlist ${playlist?.title.toLowerCase()}.`,
      images: [
        {
          url: "/open-graph/og-image.png"
        }
      ]
    }
  };
}

const PlaylistPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;
  const userMetadata = user?.user_metadata as UserMetadata;
  const userName = userMetadata?.name;

  const isConnected = !!userId;

  return (
    <Suspense fallback={<PlaylistGridSkeleton />}>
      <PlaylistGrid
        playlistSlug={slug}
        isConnected={isConnected}
        userId={userId}
        userName={userName}
      />
    </Suspense>
  );
};

export default PlaylistPage;
