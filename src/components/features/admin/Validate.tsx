"use client";
import "client-only";

import React, { useState } from "react";
import type { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import Span from "@/components/typography/span";
import Semibold from "@/components/typography/semibold";
import { approveSummaryRequest, rejectSummaryRequest } from "@/actions/admin/validate";
import { useToast } from "@/components/ui/use-toast";
import { Loader2Icon } from "lucide-react";

const Validate = ({ summaryRequests }: { summaryRequests: Tables<"summary_requests">[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const { toast } = useToast();

  const handleApprove = async () => {
    setIsApproving(true);

    try {
      await approveSummaryRequest(summaryRequests[currentIndex].id);
      toast({
        title: "Demande de résumé approuvée",
        description: "La demande de résumé a été approuvée avec succès"
      });

      setCurrentIndex((prevIndex) => (prevIndex + 1) % summaryRequests.length);
    } catch (error) {
      console.error("Error while approving summary request", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation de la demande de résumé",
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);

    try {
      await rejectSummaryRequest(summaryRequests[currentIndex].id);
      toast({
        title: "Demande de résumé rejetée",
        description: "La demande de résumé a été rejetée avec succès"
      });

      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + summaryRequests.length) % summaryRequests.length
      );
    } catch (error) {
      console.error("Error while rejecting summary request", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet de la demande de résumé",
        variant: "destructive"
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <Span>
          <Semibold>{summaryRequests[currentIndex].title}</Semibold> de{" "}
          <Semibold>{summaryRequests[currentIndex].author}</Semibold>
        </Span>
      </div>
      <div className="grid w-full grid-cols-2 gap-4">
        <Button
          variant="destructive"
          onClick={handleReject}
          disabled={isRejecting}
          className="flex items-center gap-2"
        >
          {isRejecting && <Loader2Icon className="h-3 w-3 animate-spin" />}
          Rejeter
        </Button>

        <Button onClick={handleApprove} disabled={isApproving} className="flex items-center gap-2">
          {isApproving && <Loader2Icon className="h-3 w-3 animate-spin" />}
          Approuver
        </Button>
      </div>
    </div>
  );
};

export default Validate;
