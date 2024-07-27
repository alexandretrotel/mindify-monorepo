"use client";
import "client-only";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UUID } from "crypto";
import { markSummaryAsRead, markSummaryAsUnread } from "@/actions/summaries";

const MarkAsReadButton = ({
  isSummaryRead,
  userId,
  summaryId
}: {
  isSummaryRead: boolean;
  userId: UUID;
  summaryId: number;
}) => {
  const [optimisticSummaryRead, setOptimisticSummaryRead] = useState(isSummaryRead);

  const { toast } = useToast();

  const handleClick = async () => {
    setOptimisticSummaryRead(!optimisticSummaryRead);

    if (optimisticSummaryRead) {
      try {
        await markSummaryAsUnread(userId, summaryId);
      } catch (error) {
        console.error(error);
        setOptimisticSummaryRead(true);
        toast({ title: "Une erreur s'est produite !", variant: "destructive" });
      }
    } else {
      try {
        await markSummaryAsRead(userId, summaryId);
      } catch (error) {
        console.error(error);
        setOptimisticSummaryRead(false);
        toast({ title: "Une erreur s'est produite !", variant: "destructive" });
      }
    }
  };

  if (optimisticSummaryRead) {
    return (
      <Button variant="default" className="flex items-center gap-2" onClick={handleClick} disabled>
        Déjà lu <CheckIcon className="h-4 w-4" />
      </Button>
    );
  } else {
    return (
      <Button variant="outline" className="flex items-center gap-2" onClick={handleClick}>
        Fini de lire ?
      </Button>
    );
  }
};

export default MarkAsReadButton;
