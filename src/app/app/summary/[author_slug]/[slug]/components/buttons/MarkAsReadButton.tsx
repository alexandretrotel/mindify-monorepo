import React from "react";
import { UUID } from "crypto";
import { hasUserReadSummary } from "@/actions/users";
import MarkAsReadButtonClient from "@/app/app/summary/[author_slug]/[slug]/components/buttons/client/MarkAsReadButtonClient";
import { createClient } from "@/utils/supabase/server";

const MarkAsReadButton = async ({ summaryId }: { summaryId: number }) => {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id as UUID;

  const isSummaryRead = await hasUserReadSummary({ userId, summaryId });

  return (
    <MarkAsReadButtonClient
      isSummaryRead={isSummaryRead as boolean}
      userId={userId}
      summaryId={summaryId}
    />
  );
};

export default MarkAsReadButton;
