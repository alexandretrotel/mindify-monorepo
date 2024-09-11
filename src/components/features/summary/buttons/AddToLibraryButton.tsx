import React from "react";
import { UUID } from "crypto";
import { hasUserSavedSummary } from "@/actions/users.action";
import AddToLibraryButtonClient from "@/components/features/summary/buttons/client/AddToLibraryButtonClient";

const AddToLibraryButton = async ({ summaryId, userId }: { summaryId: number; userId: UUID }) => {
  const isSummarySaved = await hasUserSavedSummary(userId, summaryId);

  return (
    <AddToLibraryButtonClient
      userId={userId}
      summaryId={summaryId}
      isSummarySaved={isSummarySaved as boolean}
    />
  );
};

export default AddToLibraryButton;
