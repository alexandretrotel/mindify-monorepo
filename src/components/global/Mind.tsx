"use client";
import "client-only";

import React, { useState } from "react";
import H4Span from "@/components/typography/h4AsSpan";
import P from "@/components/typography/p";
import { Button } from "@/components/ui/button";
import { Muted } from "@/components/typography/muted";
import type { Tables } from "@/types/supabase";
import { saveMind, unsaveMind } from "@/actions/minds";
import { useToast } from "@/components/ui/use-toast";
import { UUID } from "crypto";

const Mind = ({
  mind,
  initialIsSaved,
  userId,
  isConnected
}: {
  mind: Tables<"minds"> & {
    summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
  };
  initialIsSaved: boolean;
  userId: UUID;
  isConnected: boolean;
}) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const { toast } = useToast();

  const handleSaveMind = async () => {
    if (isSaved) {
      setIsSaved(false);

      try {
        await unsaveMind(mind?.id, userId);
      } catch (error) {
        setIsSaved(true);
        console.error(error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le mind.",
          variant: "destructive"
        });
      }
    } else {
      setIsSaved(true);

      try {
        await saveMind(mind?.id, userId);
      } catch (error) {
        setIsSaved(false);
        console.error(error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder le mind.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-lg border p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <H4Span>{mind?.summaries?.title}</H4Span>
          <Muted size="sm">{mind?.summaries?.authors?.name}</Muted>
        </div>

        <P size="lg">{mind?.text}</P>
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        <Button
          variant={isSaved ? "default" : "outline"}
          onClick={handleSaveMind}
          disabled={!isConnected}
        >
          {isSaved ? "Enregistré" : "Enregistrer"}
        </Button>

        <Button
          disabled
          variant="secondary"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: mind?.summaries?.title,
                text: mind?.text,
                url: window.location.href
              });

              return;
            }

            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              toast({
                title: "Lien copié",
                description: "Le lien a été copié dans le presse-papiers."
              });
            } else {
              toast({
                title: "Erreur",
                description: "Impossible de partager le mind.",
                variant: "destructive"
              });
            }
          }}
        >
          Partager
        </Button>
      </div>
    </div>
  );
};

export default Mind;
