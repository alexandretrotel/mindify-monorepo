import FlashcardGrid from "@/components/features/learn/FlashcardGrid";
import LearnFullscreen from "@/components/features/learn/LearnFullscreen";
import FlashcardGridSkeleton from "@/components/features/learn/skeleton/FlashcardGridSkeleton";
import H3 from "@/components/typography/h3";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default async function LearnPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userId = user.id as UUID;
  const userMetadata = user.user_metadata;
  const userName = userMetadata.name;

  const isConnected = !!user;

  return (
    <React.Fragment>
      <div className="flex flex-col gap-8">
        <H3>Apprendre</H3>

        <Suspense fallback={<FlashcardGridSkeleton />}>
          <FlashcardGrid userId={userId} />
        </Suspense>
      </div>

      <LearnFullscreen userId={userId} userName={userName} isConnected={isConnected} />
    </React.Fragment>
  );
}
