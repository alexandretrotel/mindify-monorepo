import React from "react";
import { UUID } from "crypto";
import { hasUserReadSummary } from "@/actions/users";
import MarkAsReadButtonClient from "@/app/app/summary/[author_slug]/[slug]/components/buttons/client/MarkAsReadButtonClient";

const MarkAsReadButton = async ({ summaryId, userId }: { summaryId: number; userId: UUID }) => {
  const isSummaryRead = await hasUserReadSummary(userId, summaryId);

  return (
    <MarkAsReadButtonClient
      isSummaryRead={isSummaryRead as boolean}
      userId={userId}
      summaryId={summaryId}
    />
  );
};

export default MarkAsReadButton;
