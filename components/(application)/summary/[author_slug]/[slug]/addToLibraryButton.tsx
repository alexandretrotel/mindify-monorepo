"use client";
import "client-only";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, LibraryBigIcon } from "lucide-react";
import { addSummaryToLibrary, removeSummaryFromLibrary } from "@/actions/summaries";
import { UUID } from "crypto";
import { useToast } from "@/components/ui/use-toast";

const AddToLibraryButton = ({
  userId,
  summaryId,
  isSummarySaved
}: {
  userId: UUID;
  summaryId: number;
  isSummarySaved: boolean;
}) => {
  const [optimisticSummarySaved, setOptimisticSummarySaved] = useState(isSummarySaved);

  const { toast } = useToast();

  const handleClick = async () => {
    setOptimisticSummarySaved(!optimisticSummarySaved);

    if (optimisticSummarySaved) {
      try {
        await removeSummaryFromLibrary(userId, summaryId);
      } catch (error) {
        console.error(error);
        setOptimisticSummarySaved(true);
        toast({ title: "Une erreur s'est produite !", variant: "destructive" });
      }
    } else {
      try {
        await addSummaryToLibrary(userId, summaryId);
      } catch (error) {
        console.error(error);
        setOptimisticSummarySaved(false);
        toast({ title: "Une erreur s'est produite !", variant: "destructive" });
      }
    }
  };

  if (optimisticSummarySaved) {
    return (
      <Button variant="default" size="sm" className="flex items-center gap-2" onClick={handleClick}>
        Enregistré <CheckIcon className="h-4 w-4" />
      </Button>
    );
  } else {
    return (
      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleClick}>
        <LibraryBigIcon className="h-4 w-4" />
        Ajouter à ma bibliothèque
      </Button>
    );
  }
};

export default AddToLibraryButton;
