import React from "react";
import MindsClient from "@/components/global/MindsClient";
import type { UUID } from "crypto";
import { getMindsFromUserId, isMindSaved } from "@/actions/minds";
import type { Tables } from "@/types/supabase";
import Span from "@/components/typography/span";
import { Carousel } from "@/components/ui/carousel";

const ProfileMinds = async ({ profileId }: { profileId: UUID }) => {
  const profileMinds = (await getMindsFromUserId(profileId)) as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  })[];

  if (!profileMinds || profileMinds?.length === 0) {
    return null;
  }

  const initialAreSaved = await Promise.all(
    profileMinds?.map(async (mind) => {
      const isSaved = await isMindSaved(mind?.id).catch(() => false);
      return isSaved;
    })
  );

  return (
    <div className="flex flex-col gap-4">
      <Span size="lg" semibold>
        <span className="flex items-center">MINDS</span>
      </Span>
      <Carousel opts={{ align: "start", slidesToScroll: "auto" }} className="w-full">
        <MindsClient minds={profileMinds} initialAreSaved={initialAreSaved} />
      </Carousel>
    </div>
  );
};

export default ProfileMinds;
