"use client";
import "client-only";

import Semibold from "@/components/typography/semibold";
import Span from "@/components/typography/span";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Tables } from "@/types/supabase";
import React from "react";
import ReactCardFlip from "react-card-flip";
import { saveMind, unsaveMind } from "@/actions/minds";
import { useToast } from "@/components/ui/use-toast";
import type { UUID } from "crypto";

const SummaryFlashcardMind = ({
  mind,
  index,
  totalLength,
  handleFullscreen,
  handleNext,
  initialIsSaved,
  userId,
  userName,
  isConnected
}: {
  mind: Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  };
  index: number;
  totalLength: number;
  handleFullscreen: () => void;
  handleNext: () => void;
  initialIsSaved: boolean;
  userId: UUID;
  userName: string;
  isConnected: boolean;
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const showBack = () => {
    setIsFlipped(true);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <Front
        mind={mind}
        index={index}
        totalLength={totalLength}
        onFlip={showBack}
        handleFullscreen={handleFullscreen}
        handleNext={handleNext}
      />
      <Back
        mind={mind}
        index={index}
        totalLength={totalLength}
        handleNext={handleNext}
        handleFullscreen={handleFullscreen}
        initialIsSaved={initialIsSaved}
        userId={userId}
        userName={userName}
        isConnected={isConnected}
      />
    </ReactCardFlip>
  );
};

function Front({
  mind,
  index,
  totalLength,
  onFlip,
  handleFullscreen,
  handleNext
}: Readonly<{
  mind: Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  };
  index: number;
  totalLength: number;
  onFlip: () => void;
  handleFullscreen: () => void;
  handleNext: () => void;
}>) {
  return (
    <Card className="flex w-full min-w-80 max-w-md flex-col md:min-w-[28rem]">
      <div className="flex h-full min-h-96 flex-col justify-between gap-8">
        <CardHeader>
          <div className="flex items-start justify-between gap-8">
            <div className="flex flex-col">
              <Semibold>{mind.summaries.title}</Semibold>
              <Span size="sm">{mind.summaries.authors.name}</Span>
            </div>

            <Semibold>
              {index + 1}/{totalLength}
            </Semibold>
          </div>
        </CardHeader>

        <CardContent>
          <Semibold size="lg">{mind.question}</Semibold>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={onFlip}>
            Afficher le MIND
          </Button>

          <div className="grid w-full grid-cols-2 gap-4">
            <Button variant="ghost" onClick={handleFullscreen}>
              Passer au résumé
            </Button>
            <Button variant="ghost" onClick={handleNext}>
              Passer au MIND suivant
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

function Back({
  mind,
  index,
  totalLength,
  handleNext,
  handleFullscreen,
  initialIsSaved,
  userId,
  userName,
  isConnected
}: Readonly<{
  mind: Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  };
  index: number;
  totalLength: number;
  handleNext: () => void;
  handleFullscreen: () => void;
  initialIsSaved: boolean;
  userId: UUID;
  userName: string;
  isConnected: boolean;
}>) {
  const [isSaved, setIsSaved] = React.useState(initialIsSaved);
  const [isNavigatorShareSupported, setIsNavigatorShareSupported] = React.useState<boolean>(false);
  const [origin, setOrigin] = React.useState<string | undefined>(undefined);

  const { toast } = useToast();

  React.useEffect(() => {
    setIsNavigatorShareSupported(!!navigator.share);
    setOrigin(window.location.origin);
  }, []);

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

  const handleShareMind = async () => {
    const url = `${origin}/mind/${mind?.id}` + (isConnected ? `?sharedBy=${userId}` : "");

    if (isNavigatorShareSupported) {
      navigator.share({
        title: "Partager un MIND",
        text: `${userName} vous partage un MIND sur Mindify`,
        url
      });
      return;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${userName} vous partage un MIND sur Mindify : ${url}`);
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
  };

  return (
    <Card className="flex w-full min-w-80 max-w-md flex-col md:min-w-[28rem]">
      <div className="flex h-full min-h-96 flex-col justify-between gap-8">
        <CardHeader>
          <div className="flex items-start justify-between gap-8">
            <div className="flex flex-col">
              <Semibold>{mind.summaries.title}</Semibold>
              <Span size="sm">{mind.summaries.authors.name}</Span>
            </div>

            <Semibold>
              {index + 1}/{totalLength}
            </Semibold>
          </div>
        </CardHeader>

        <CardContent>
          <Semibold size="lg">{mind.text}</Semibold>
        </CardContent>

        <CardFooter>
          <div className="flex w-full flex-col gap-4">
            <div className="grid w-full grid-cols-2 gap-4">
              <Button
                variant={isSaved ? "default" : "outline"}
                className="w-full"
                onClick={handleSaveMind}
                disabled={!isConnected}
              >
                {isSaved ? "Enregistré" : "Enregistrer"}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleShareMind}>
                Partager
              </Button>
            </div>
            <Button
              className="w-full"
              onClick={index === totalLength - 1 ? handleFullscreen : handleNext}
            >
              {index === totalLength - 1 ? "Lire le résumé" : "Passer au MIND suivant"}
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

export default SummaryFlashcardMind;
