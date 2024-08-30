import PlaylistGrid from "@/components/features/playlist/PlaylistGrid";
import PlaylistGridSkeleton from "@/components/features/playlist/skeleton/PlaylistGridSkeleton";
import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";
import React, { Suspense } from "react";

const PlaylistPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;

  const isConnected = !!userId;

  return (
    <Suspense fallback={<PlaylistGridSkeleton />}>
      <PlaylistGrid playlistSlug={slug} isConnected={isConnected} userId={userId} />
    </Suspense>
  );
};

export default PlaylistPage;
