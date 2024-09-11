import React from "react";
import { UUID } from "crypto";
import { hasUserReadSummary } from "@/actions/users.action";
import MarkAsReadButtonClient from "@/components/features/summary/buttons/client/MarkAsReadButtonClient";

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
