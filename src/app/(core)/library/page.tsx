import Library from "@/components/features/library/Library";
import LibrarySkeleton from "@/components/features/library/skeleton/LibrarySkeleton";
import type { SummaryStatus } from "@/types/summary";
import type { Enums } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

const LibraryPage = async ({
  searchParams
}: Readonly<{
  searchParams: { search: string; topic: string; source: Enums<"source">; status: SummaryStatus };
}>) => {
  const { search, topic, source, status } = searchParams;

  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;

  return (
    <Suspense fallback={<LibrarySkeleton />}>
      <Library
        initialSearch={search}
        initialTopic={topic}
        initialSource={source}
        initialStatus={status}
        userId={userId}
      />
    </Suspense>
  );
};

export default LibraryPage;
