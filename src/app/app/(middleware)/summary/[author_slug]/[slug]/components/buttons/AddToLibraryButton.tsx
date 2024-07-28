import React from "react";
import { UUID } from "crypto";
import { hasUserSavedSummary } from "@/src/actions/users";
import AddToLibraryButtonClient from "@/src/app/app/(middleware)/summary/[author_slug]/[slug]/components/buttons/client/AddToLibraryButtonClient";

const AddToLibraryButton = async ({ userId, summaryId }: { userId: UUID; summaryId: number }) => {
  const isSummarySaved = await hasUserSavedSummary({ userId, summaryId });

  return (
    <AddToLibraryButtonClient
      userId={userId}
      summaryId={summaryId}
      isSummarySaved={isSummarySaved}
    />
  );
};

export default AddToLibraryButton;
