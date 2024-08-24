import React, { Suspense } from "react";
import ProfileMindsClient from "@/components/features/profile/minds/client/ProfileMindsClient";
import type { UUID } from "crypto";
import { areMindsSaved, getMindsFromUserId } from "@/actions/minds";
import type { Tables } from "@/types/supabase";
import ProfileMindsSkeleton from "@/components/features/profile/minds/skeleton/ProfileMindsSkeleton";

const ProfileMinds = async ({
  profileId,
  userId,
  isConnected
}: {
  profileId: UUID;
  userId: UUID;
  isConnected: boolean;
}) => {
  const profileMinds = (await getMindsFromUserId(profileId)) as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[];

  if (!profileMinds || profileMinds?.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-2xl font-semibold">
        Aucun MINDS
      </div>
    );
  }

  const profileMindsIds = profileMinds?.map((mind) => mind?.id);

  let initialAreSaved: boolean[] = profileMindsIds.map(() => false);
  if (isConnected) {
    initialAreSaved = await areMindsSaved(profileMindsIds, userId);
  }

  return (
    <Suspense fallback={<ProfileMindsSkeleton />}>
      <ProfileMindsClient
        minds={profileMinds}
        initialAreSaved={initialAreSaved}
        userId={userId}
        isConnected={isConnected}
      />
    </Suspense>
  );
};

export default ProfileMinds;
