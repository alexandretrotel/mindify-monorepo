import Library from "@/components/features/library/Library";
import LibrarySkeleton from "@/components/features/library/skeleton/LibrarySkeleton";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import React, { Suspense } from "react";

const LibraryPage = async () => {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;

  return (
    <Suspense fallback={<LibrarySkeleton />}>
      <Library userId={userId} />
    </Suspense>
  );
};

export default LibraryPage;
