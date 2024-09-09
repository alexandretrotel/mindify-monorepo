"use client";
import "client-only";

import Semibold from "@/components/typography/semibold";
import Span from "@/components/typography/span";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Tables } from "@/types/supabase";
import React from "react";
import ReactCardFlip from "react-card-flip";
import { useToast } from "@/components/ui/use-toast";
import type { UUID } from "crypto";
import { FlashcardContext } from "@/providers/FlashcardProvider";

const Flashcard = ({
  mind,
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
  userId: UUID;
  userName: string;
  isConnected: boolean;
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const { currentCard, setCurrentCard, totalLength } = React.useContext(FlashcardContext);

  const showBack = () => {
    setIsFlipped(true);
  };

  const handleNext = () => {
    if (currentCard - 1 === totalLength) {
      return;
    }

    setIsFlipped(false);
    setCurrentCard(currentCard + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <Front mind={mind} onFlip={showBack} />
        <Back mind={mind} userId={userId} userName={userName} isConnected={isConnected} />
      </ReactCardFlip>

      {isFlipped && (
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={handleNext}>
            À revoir
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Difficile
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Correct
          </Button>
          <Button variant="outline" onClick={handleNext}>
            Facile
          </Button>
        </div>
      )}
    </div>
  );
};

function Front({
  mind,
  onFlip
}: Readonly<{
  mind: Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  };
  onFlip: () => void;
}>) {
  return (
    <Card className="flex w-full min-w-80 max-w-md flex-col md:min-w-[28rem]">
      <div className="flex h-full min-h-96 flex-col justify-between gap-4">
        <CardHeader>
          <div className="flex items-start justify-between gap-8">
            <div className="flex flex-col">
              <Semibold>{mind.summaries.title}</Semibold>
              <Span size="sm">{mind.summaries.authors.name}</Span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Semibold size="lg">{mind.question}</Semibold>
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={onFlip}>
            Afficher le MIND
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

function Back({
  mind,
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
  userId: UUID;
  userName: string;
  isConnected: boolean;
}>) {
  const [isNavigatorShareSupported, setIsNavigatorShareSupported] = React.useState<boolean>(false);
  const [origin, setOrigin] = React.useState<string | undefined>(undefined);

  const { toast } = useToast();

  React.useEffect(() => {
    setIsNavigatorShareSupported(!!navigator.share);
    setOrigin(window.location.origin);
  }, []);

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
      <div className="flex h-full min-h-96 flex-col justify-between gap-4">
        <CardHeader>
          <div className="flex items-start justify-between gap-8">
            <div className="flex flex-col">
              <Semibold>{mind.summaries.title}</Semibold>
              <Span size="sm">{mind.summaries.authors.name}</Span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Semibold size="lg">{mind.text}</Semibold>
        </CardContent>

        <CardFooter>
          <Button variant="secondary" className="w-full" onClick={handleShareMind}>
            Partager
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default Flashcard;
