import React from "react";
import { UUID } from "crypto";
import { hasUserReadSummary } from "@/src/actions/users";
import MarkAsReadButtonClient from "@/src/app/app/(middleware)/summary/[author_slug]/[slug]/components/buttons/client/MarkAsReadButtonClient";

const MarkAsReadButton = async ({ userId, summaryId }: { userId: UUID; summaryId: number }) => {
  const isSummaryRead = await hasUserReadSummary({ userId, summaryId });

  return (
    <MarkAsReadButtonClient isSummaryRead={isSummaryRead} userId={userId} summaryId={summaryId} />
  );
};

export default MarkAsReadButton;
