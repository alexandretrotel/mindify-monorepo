import React from "react";
import { UUID } from "crypto";
import { hasUserSavedSummary } from "@/actions/users";
import AddToLibraryButtonClient from "@/app/app/summary/[author_slug]/[slug]/components/buttons/client/AddToLibraryButtonClient";
import { createClient } from "@/utils/supabase/server";

const AddToLibraryButton = async ({ summaryId }: { summaryId: number }) => {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id as UUID;

  const isSummarySaved = await hasUserSavedSummary({ userId, summaryId });

  return (
    <AddToLibraryButtonClient
      userId={userId}
      summaryId={summaryId}
      isSummarySaved={isSummarySaved as boolean}
    />
  );
};

export default AddToLibraryButton;
